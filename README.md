# 🏆 Player Team Balancer

## ▶️ How to Run

1.  📦 Make sure you have **Node.js (>=18)** installed.

2.  ⚙️ Install dependencies:

    ```bash
    npm install
    ```

3.  📂 Place your CSV file inside the `data/` folder (default:
    `level_a_players.csv`).

4.  ▶️ Run the program:

    ```bash
    npm start
    ```

---

## 💡 Approach

The goal of this script is to balance players into teams based on their
normalized performance metrics:

1.  📊 **CSV Parsing** → Player data is loaded from a CSV file.  
    Numeric fields are converted to numbers for consistent processing.

2.  🎚️ **Normalization** → Key numeric columns are normalized between 0
    and 1 so no metric dominates.

    The following columns were included because they directly reflect
    **player activity, consistency, and contribution**:

    -   `historical_events_participated` → overall involvement  
    -   `historical_event_engagements` → depth of engagement  
    -   `historical_points_earned` → performance and achievements  
    -   `historical_messages_sent` → social interaction  
    -   `days_active_last_30` → recent consistency and activeness  

    Other columns (e.g., `historical_points_spent`,
    `current_total_points`, `current_streak_value`, `last_active_ts`,
    team identifiers) were **discarded from scoring** because they either:

    -   did not directly represent skill or impact on balance,  
    -   were redundant or less reliable,  
    -   or introduced noise instead of helping fairness.  

3.  🧮 **Score Calculation** → Each player's score = sum of their
    normalized metrics.

4.  ⚖️ **Balancing Algorithm** → Players are sorted by score
    (descending), then assigned iteratively to the team with the:

    1.  **lowest total score**, and  
    2.  if tied, the **fewest players**.  

    👉 This tie-break rule ensures both **score balance** and **team size parity**.

5.  📋 **Reporting** → At the end, the program prints a summary per team including:  

    - Team size  
    - Average player score  
    - Total team score  

    These aggregates make fairness transparent to users.

---

## ⚖️ Key Tradeoffs

-   🏃 **Simplicity over optimization** → Used a greedy algorithm (next
    strongest → weakest team). Fair, but not always perfectly optimal.  
-   ➕ **Single scoring method** → Used simple sum of normalized values,
    without weights.  
-   📊 **Explainability focus** → Added tie-break and team report to
    increase user trust.  
-   🖥️ **Console-only output** → No external file export (for speed).  

---

## ✨ If I Had More Time

-   ⚖️ Add configurable **weights** per metric (so experts can tune importance).  
-   📤 Export team assignments to **JSON/CSV** or a database.  
-   🧠 Try advanced balancing (linear programming, simulated annealing, clustering).  
-   ✅ Add **unit tests** for normalization & scoring.  
-   🌐 Build a simple **web UI** to visualize teams.  
