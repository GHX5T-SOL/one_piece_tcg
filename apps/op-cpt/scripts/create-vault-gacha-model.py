import bpy
import math
import os
import random
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "models", "vault-gacha-machine.glb")

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.unit_settings.system = 'METRIC'

# Materials

def mat_principled(name, base, metallic=0.0, roughness=0.3, alpha=1.0, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    if bsdf:
        bsdf.inputs['Base Color'].default_value = base
        bsdf.inputs['Metallic'].default_value = metallic
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Alpha'].default_value = alpha
        if emission:
            bsdf.inputs['Emission Color'].default_value = emission
            bsdf.inputs['Emission Strength'].default_value = emission_strength
    mat.blend_method = 'BLEND' if alpha < 1 else 'OPAQUE'
    mat.use_screen_refraction = alpha < 1
    return mat

NAVY = mat_principled('vault_navy_enamel', (0.008, 0.045, 0.11, 1), metallic=0.18, roughness=0.18)
BLUE = mat_principled('vault_blue_lacquer', (0.0, 0.17, 0.56, 1), metallic=0.34, roughness=0.16)
GOLD = mat_principled('polished_gold_trim', (1.0, 0.64, 0.09, 1), metallic=0.92, roughness=0.12)
DARK_GOLD = mat_principled('aged_gold_shadow', (0.36, 0.2, 0.02, 1), metallic=0.9, roughness=0.18)
CREAM = mat_principled('warm_ivory_enamel', (1.0, 0.92, 0.74, 1), metallic=0.02, roughness=0.22)
CORAL = mat_principled('coral_prize_light', (1.0, 0.28, 0.2, 1), metallic=0.12, roughness=0.18, emission=(1.0, 0.08, 0.03, 1), emission_strength=0.22)
SKY = mat_principled('sky_blue_prize_light', (0.42, 0.78, 1.0, 1), metallic=0.1, roughness=0.14, emission=(0.16, 0.66, 1.0, 1), emission_strength=0.18)
GLASS = mat_principled('thick_smoked_glass', (0.66, 0.9, 1.0, 0.42), metallic=0.0, roughness=0.02, alpha=0.42)
GLOW = mat_principled('vault_core_glow', (1.0, 0.85, 0.32, 1), metallic=0.3, roughness=0.1, emission=(1.0, 0.62, 0.02, 1), emission_strength=1.3)
CARD_RED = mat_principled('sample_card_red', (0.95, 0.18, 0.15, 1), metallic=0.03, roughness=0.24)
CARD_BLUE = mat_principled('sample_card_blue', (0.05, 0.38, 0.92, 1), metallic=0.02, roughness=0.28)
WHITE = mat_principled('white_label_plastic', (0.96, 0.96, 0.92, 1), metallic=0.0, roughness=0.18)
BLACK = mat_principled('black_shadow_rubber', (0.005, 0.006, 0.008, 1), metallic=0.1, roughness=0.34)

# Helpers

def smooth_bevel(obj, bevel=0.03, segments=4):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    try:
        bpy.ops.object.shade_smooth()
    except Exception:
        pass
    if bevel:
        mod = obj.modifiers.new('soft bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = segments
        mod.affect = 'EDGES'
        obj.modifiers.new('weighted normals', 'WEIGHTED_NORMAL')
    obj.select_set(False)
    return obj


def cyl(name, radius, depth, loc, material, vertices=128, rotation=(0,0,0), bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.name = name + '_mesh'
    obj.data.materials.append(material)
    return smooth_bevel(obj, bevel, 5)


def torus(name, major, minor, loc, material, rotation=(0,0,0), major_segments=192, minor_segments=24):
    bpy.ops.mesh.primitive_torus_add(major_segments=major_segments, minor_segments=minor_segments, major_radius=major, minor_radius=minor, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.name = name + '_mesh'
    obj.data.materials.append(material)
    return smooth_bevel(obj, 0, 0)


def sphere(name, radius, loc, material, scale=(1,1,1), segments=96):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=max(24, segments//2), radius=radius, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.name = name + '_mesh'
    obj.data.materials.append(material)
    return smooth_bevel(obj, 0, 0)


def cube(name, loc, scale, material, rotation=(0,0,0), bevel=0.03):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    return smooth_bevel(obj, bevel, 6)

# Root empty for runtime animation
root = bpy.data.objects.new('vault_gacha_machine_root', None)
bpy.context.collection.objects.link(root)

# Premium base and enamel body
parts = []
parts.append(cyl('base_shadow_plinth', 2.55, 0.32, (0, 0, 0.05), BLACK, vertices=160, bevel=0.04))
parts.append(cyl('base_gold_outer_ring', 2.38, 0.16, (0, 0, 0.24), GOLD, vertices=160, bevel=0.03))
parts.append(cyl('base_navy_steps', 2.08, 0.42, (0, 0, 0.47), NAVY, vertices=160, bevel=0.05))
parts.append(cyl('body_blue_enamel', 1.54, 1.42, (0, 0, 1.18), BLUE, vertices=160, bevel=0.035))
parts.append(cyl('body_gold_lip_lower', 1.62, 0.13, (0, 0, 0.51), GOLD, vertices=160, bevel=0.018))
parts.append(torus('body_gold_lip_upper_open_ring', 1.48, 0.075, (0, 0, 1.91), GOLD, major_segments=192, minor_segments=24))

# Glass dome and trim
parts.append(sphere('glass_dome', 1.58, (0, 0, 2.04), GLASS, scale=(1,1,0.72), segments=128))
parts.append(torus('spin_ring', 1.47, 0.055, (0, 0, 2.04), GOLD, rotation=(0,0,0)))
parts.append(torus('dome_inner_light_ring', 0.86, 0.03, (0, 0, 2.78), GLOW, rotation=(0,0,0), major_segments=160, minor_segments=18))
parts.append(cyl('dome_crown_cap', 0.32, 0.11, (0,0,3.14), GOLD, vertices=128, bevel=0.025))
parts.append(sphere('crown_glow_orb', 0.13, (0,0,3.24), GLOW, scale=(1,1,0.82), segments=64))

# Front vault door assembly facing -Y
front_y = -1.64
parts.append(cyl('front_vault_door_gold', 0.66, 0.16, (0, front_y, 1.12), GOLD, vertices=128, rotation=(math.pi/2,0,0), bevel=0.012))
parts.append(cyl('front_vault_door_navy', 0.52, 0.18, (0, front_y-0.02, 1.12), NAVY, vertices=128, rotation=(math.pi/2,0,0), bevel=0.012))
for r in (0.24, 0.38):
    parts.append(torus(f'front_door_trim_{r}', r, 0.016, (0, front_y-0.12, 1.12), GOLD, rotation=(math.pi/2,0,0), major_segments=128, minor_segments=12))
for i in range(12):
    angle = i * math.tau / 12
    parts.append(sphere(f'front_door_bolt_{i:02d}', 0.035, (math.cos(angle)*0.47, front_y-0.2, 1.12 + math.sin(angle)*0.47), GOLD, segments=32))
parts.append(cyl('front_keyhole_head', 0.09, 0.02, (0, front_y-0.23, 1.18), GOLD, vertices=64, rotation=(math.pi/2,0,0), bevel=0.0))
parts.append(cube('front_keyhole_slot', (0, front_y-0.24, 1.02), (0.09,0.025,0.24), GOLD, bevel=0.01))

# Prize chute, coin slot, display
parts.append(cube('prize_chute_shadow', (-0.45, front_y-0.08, 0.64), (0.62,0.16,0.18), DARK_GOLD, bevel=0.04))
parts.append(cube('prize_chute_ivory_lip', (-0.45, front_y-0.18, 0.72), (0.5,0.08,0.08), CREAM, bevel=0.03))
parts.append(cube('digital_display_panel', (0.58, front_y-0.1, 0.72), (0.56,0.08,0.18), BLACK, bevel=0.025))
parts.append(cube('digital_display_glow', (0.58, front_y-0.16, 0.72), (0.48,0.02,0.1), SKY, bevel=0.01))
parts.append(cube('coin_slot_gold', (0.58, front_y-0.16, 0.98), (0.44,0.04,0.09), GOLD, bevel=0.015))

# Side columns and lever
for side in (-1,1):
    parts.append(cyl(f'side_column_{side}_gold', 0.16, 1.16, (side*1.72, -0.22, 1.05), GOLD, vertices=80, bevel=0.025))
    parts.append(sphere(f'side_column_{side}_orb', 0.18, (side*1.72, -0.22, 1.68), CREAM, segments=64))
    parts.append(sphere(f'side_column_{side}_foot', 0.16, (side*1.72, -0.22, 0.45), GOLD, segments=64))
lever = bpy.data.objects.new('lever_root', None)
bpy.context.collection.objects.link(lever)
lever.location = (1.86, -0.74, 1.22)
parts.append(cyl('lever_gold_arm', 0.045, 0.9, (1.86, -0.74, 1.02), GOLD, vertices=48, rotation=(0.38,0.18,0.0), bevel=0.006))
parts[-1].parent = lever
parts.append(sphere('lever_coral_knob', 0.17, (1.98, -0.92, 0.62), CORAL, segments=64))
parts[-1].parent = lever

# Capsules inside dome: two halves with premium materials
rng = random.Random(33)
capsule_parent = bpy.data.objects.new('capsule_cluster', None)
bpy.context.collection.objects.link(capsule_parent)
for i in range(24):
    angle = i * math.tau / 24
    ring = 0.42 + (i % 5) * 0.18
    x = math.cos(angle) * ring + rng.uniform(-0.08, 0.08)
    y = math.sin(angle) * ring * 0.54 + rng.uniform(-0.05, 0.05)
    z = 1.95 + (i % 4) * 0.12 + rng.uniform(-0.04, 0.04)
    mat = [GOLD, CORAL, SKY, CREAM][i % 4]
    s1 = sphere(f'capsule_{i:02d}_half_a', 0.15, (x-0.055, y, z), mat, scale=(0.86,1,1), segments=48)
    s2 = sphere(f'capsule_{i:02d}_half_b', 0.15, (x+0.055, y, z), GLASS, scale=(0.86,1,1), segments=48)
    s1.parent = capsule_parent
    s2.parent = capsule_parent

# Floating reveal slab/card
reveal = bpy.data.objects.new('reveal_slab_root', None)
bpy.context.collection.objects.link(reveal)
reveal.location = (0, -1.1, 1.58)
slab = cube('reveal_slab_clear_case', (0, -1.1, 1.58), (0.72, 0.08, 1.08), GLASS, rotation=(0,0,0), bevel=0.055)
slab.parent = reveal
label = cube('reveal_slab_label', (0, -1.155, 1.95), (0.58, 0.035, 0.16), WHITE, bevel=0.015)
label.parent = reveal
card = cube('reveal_slab_card_art', (0, -1.16, 1.52), (0.48, 0.035, 0.62), CARD_RED, bevel=0.018)
card.parent = reveal
stripe = cube('reveal_card_blue_stripe', (0, -1.19, 1.45), (0.42, 0.012, 0.12), CARD_BLUE, bevel=0.008)
stripe.parent = reveal

# Orbiting collectible cards behind dome
orbit = bpy.data.objects.new('orbit_card_ring', None)
bpy.context.collection.objects.link(orbit)
for i in range(8):
    angle = i * math.tau / 8
    x = math.cos(angle) * 2.18
    y = math.sin(angle) * 0.7 + 0.12
    z = 1.75 + (i % 2) * 0.25
    rot_z = -angle + math.pi / 2
    c = cube(f'orbit_card_{i:02d}', (x, y, z), (0.34, 0.025, 0.5), CARD_BLUE if i % 2 else CARD_RED, rotation=(0, 0, rot_z), bevel=0.015)
    c.parent = orbit
    border = cube(f'orbit_card_{i:02d}_border', (x, y-0.016, z), (0.39, 0.012, 0.56), GOLD, rotation=(0, 0, rot_z), bevel=0.012)
    border.parent = orbit

# Assign parent root where missing
for obj in bpy.context.scene.objects:
    if obj.name != root.name and obj.parent is None and obj.type != 'CAMERA' and obj.type != 'LIGHT':
        obj.parent = root

# Add hidden-ish lights for preview, harmless in GLB
bpy.ops.object.light_add(type='AREA', location=(0,-4,5))
light = bpy.context.object
light.name = 'preview_softbox'
light.data.energy = 650
light.data.size = 5
bpy.ops.object.camera_add(location=(0, -6, 2.4), rotation=(math.radians(68), 0, 0))
scene.camera = bpy.context.object

# Export
os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format='GLB',
    export_apply=False,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    export_draco_mesh_compression_enable=False,
)
print(f'Exported {OUT} ({os.path.getsize(OUT)/1024/1024:.2f} MB)')
