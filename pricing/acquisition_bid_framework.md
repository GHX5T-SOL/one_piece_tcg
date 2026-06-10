# Acquisition and Bidding Framework

When asked whether to buy or bid:

- Confirm exact identity and variant.
- Estimate true sellable market value.
- Build expected net by channel.
- Subtract fees, shipping, grading costs, desired profit, and risk buffer.
- Consider liquidity, downside, capital lockup, and time to sale.

Formula:

`max_bid = expected_net_sell_price - desired_profit - risk_buffer - fees - shipping - grading_costs_if_any`

Outputs:

- ideal_bid
- max_bid
- walk_away_bid
- expected_roi
- time_to_sale_estimate
- grade_or_flip_verdict
