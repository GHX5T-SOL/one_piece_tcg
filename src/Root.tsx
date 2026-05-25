import React from 'react';
import {Composition} from 'remotion';
import {GhostZoroVideo} from './GhostZoroVideo';
import './styles.css';

export const Root: React.FC = () => {
  return (
    <Composition
      id="GhostZoroVideo"
      component={GhostZoroVideo}
      durationInFrames={9600}
      fps={24}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
