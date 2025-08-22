# 🏆 Player Team Balancer

## ▶️ How to Run

1.  📦 Make sure you have **Node.js (\>=18)** installed.\

2.  ⚙️ Install dependencies:

    ``` bash
    npm install
    ```

3.  📂 Place your CSV file inside the `data/` folder (default:
    `level_a_players.csv`).\

4.  ▶️ Run the program:

    ``` bash
    npm start
    ```

------------------------------------------------------------------------

## 💡 Approach

The goal of this script is to balance players into teams based on their
normalized performance metrics:

1.  📊 **CSV Parsing** → Player data is loaded from a CSV file.\

2.  🎚️ **Normalization** → Key numeric columns are normalized between 0
    and 1 so no metric dominates.

    The following columns were included because they directly reflect
    **player activity, consistency, and contribution**:

    -   `historical_events_participated` → shows overall involvement.\
    -   `historical_event_engagements` → measures depth of engagement in
        events.\
    -   `historical_points_earned` → reflects performance and
        achievements.\
    -   `historical_messages_sent` → indicates social interaction and
        participation.\
    -   `days_active_last_30` → represents recent consistency and
        activeness.

    Other columns (e.g., `historical_points_spent`,
    `current_total_points`, `current_streak_value`, `last_active_ts`,
    team identifiers) were **discarded** because they either:

    -   did not directly represent skill or impact on team balance,\
    -   were redundant or less reliable indicators of performance,\
    -   or introduced noise instead of helping fairness in balancing.

3.  🧮 **Score Calculation** → Each player's score = sum of their
    normalized metrics.\

4.  ⚖️ **Balancing Algorithm** → Players are sorted by score
    (descending), then assigned to the team with the **lowest total
    score**, distributing talent fairly.

------------------------------------------------------------------------

## ⚖️ Key Tradeoffs

-   🏃 **Simplicity over optimization** → Used a greedy algorithm (next
    strongest → weakest team). Fair, but not always perfectly optimal.\
-   ➕ **Single scoring method** → Used simple sum of normalized values,
    without weights.\
-   🖥️ **Console-only output** → No external file export (for speed).

------------------------------------------------------------------------

## ✨ If I Had More Time

-   ⚖️ Add configurable **weights** per metric (so experts can tune importance).  
-   📤 Export team assignments to **JSON/CSV** or a database.  
-   🧠 Try advanced balancing (linear programming, simulated annealing, clustering).  
-   ✅ Add **unit tests** for normalization & scoring.  
-   🌐 Build a simple **web UI** to visualize teams.  