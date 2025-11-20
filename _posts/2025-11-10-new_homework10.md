<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<style>
  .poisson-container {
      max-width: 900px;
      margin: auto;
      padding: 10px;
  }

  .input-bar {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 14px;
      border-radius: 10px;
      background: rgba(255,255,255,0.05);
      margin-bottom: 25px;
  }

  .input-group {
      display: flex;
      flex-direction: column;
      font-size: 14px;
  }

  input[type=number] {
      padding: 6px;
      border-radius: 6px;
      border: 1px solid #666;
      background: transparent;
      color: inherit;
      width: 90px;
  }

  button {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background: #4da3ff;
      cursor: pointer;
      font-weight: bold;
  }
  button:hover { opacity: .85; }

  .plot-box {
      margin-bottom: 40px;
      padding: 18px;
      background: rgba(255,255,255,0.06);
      border-radius: 14px;
  }

</style>

<div class="poisson-container">

<div class="input-bar">
    <div class="input-group">
        <label>λ (Lambda)</label>
        <input id="lambda_input" type="number" value="5" min="0.1" step="0.1">
    </div>

    <div class="input-group">
        <label>T</label>
        <input id="time_input" type="number" value="1" min="0.1" step="0.1">
    </div>

    <div class="input-group">
        <label>N (Steps)</label>
        <input id="n_input" type="number" value="5000" min="100" step="100">
    </div>

    <button onclick="updateAll()">Update All</button>
</div>


<!-- ================= TRAJECTORY ================== -->
<div class="plot-box">
    <h3>1. Trajectory N(t)</h3>
    <div id="traj"></div>
</div>

<!-- ================ DISTRIBUTION ================= -->
<div class="plot-box">
    <h3>2. Distribution of N(T)</h3>
    <div id="histN"></div>
</div>

</div>

<script>

function simulateCounts(lambda, T, steps) {
    let dt = T / steps;
    let t = 0;
    let N = 0;
    let times = [0];
    let counts = [0];

    for (let i=0; i<steps; i++) {
        if (Math.random() < lambda * dt) N++;
        t += dt;
        times.push(t);
        counts.push(N);
    }
    return {times, counts};
}

// ================= CLEAN TRAJECTORY =================

function plotTrajectory(lambda, T, steps) {
    const sim = simulateCounts(lambda, T, steps);
    const maxN = Math.max(...sim.counts);
    const yMax = Math.max(5, Math.ceil(maxN * 1.12));

    // clean, rounded tick for X (time)
    const idealTicks = 8;
    const raw = T / idealTicks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    let nice;
    if (norm < 1.5) nice = 1;
    else if (norm < 3) nice = 2;
    else if (norm < 7) nice = 5;
    else nice = 10;
    const xTick = nice * mag;

    Plotly.newPlot("traj", [{
        x: sim.times,
        y: sim.counts,
        mode: "lines",
        line: { shape: "hv", width: 3 }
    }], {
        height: 380,
        xaxis: {
            title: "t",
            range: [0, T],
            dtick: xTick,
            gridcolor: "rgba(255,255,255,0.12)"
        },
        yaxis: {
            title: "N(t)",
            range: [0, yMax],
            dtick: Math.max(1, Math.round(yMax / 8)),
            gridcolor: "rgba(255,255,255,0.12)"
        },
        margin: { t: 30, r: 20, l: 60, b: 45 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)"
    });
}

// ================= DISTRIBUTION ===================

function factorial(n) { let f=1; for (let i=1;i<=n;i++) f*=i; return f; }

function poissonPMF(lambda, kmax) {
    let x=[], y=[];
    for (let k=0; k<=kmax; k++){
        x.push(k);
        y.push(Math.exp(-lambda)*(lambda**k)/factorial(k));
    }
    return {x,y};
}

function plotHistN(lambda, T, steps) {

    // Generate samples: final N(T)
    let samples = [];
    for (let i=0; i<steps; i++){
        let s = simulateCounts(lambda, T, steps);
        samples.push(s.counts[s.counts.length-1]);
    }

    const mean = lambda * T;

    // Max k to show
    const maxK = Math.max(...samples, Math.ceil(mean + 5 * Math.sqrt(mean)));

    // Bin into integer counts
    let freq = new Array(maxK + 1).fill(0);
    for (let v of samples) {
        if (v <= maxK) freq[v]++;
    }

    // Convert to density or absolute frequency (you wanted frequency)
    let xs = [...Array(maxK + 1).keys()];
    let ys = freq;

    // Poisson PMF curve (scaled to sample count)
    const pmf = poissonPMF(mean, maxK);
    const pmfScaled = pmf.y.map(v => v * steps);

    const yMax = Math.max(...ys, ...pmfScaled) * 1.15;

    // Clean integer bars
    const bars = {
        x: xs,
        y: ys,
        type: "bar",
        width: 0.9,                 // makes bars vertical without gaps
        marker: { color: "#4da3ff" },
        opacity: 0.65,
        name: "Simulated"
    };

    // Clean curve
    const curve = {
        x: pmf.x,
        y: pmfScaled,
        mode: "lines+markers",
        line: { width: 3, color: "#ffdd55" },
        marker: { size: 5, color: "#ffdd55" },
        name: "Poisson(λT)"
    };

    Plotly.newPlot("histN", [bars, curve], {
        height: 380,
        xaxis: {
            title: "k",
            dtick: 1,                        // ensures integer ticks
            gridcolor: "rgba(255,255,255,0.12)"
        },
        yaxis: {
            title: "Frequency",
            range: [0, yMax],
            gridcolor: "rgba(255,255,255,0.12)"
        },
        margin: { t: 30, r: 20, l: 60, b: 45 },
        barmode: "overlay",
        bargap: 0.05,                         // small gap, not scattered
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)"
    });
}

// ================= GLOBAL UPDATE =================

function updateAll() {
    const lambda = Number(document.getElementById("lambda_input").value);
    const T      = Number(document.getElementById("time_input").value);
    const steps  = Number(document.getElementById("n_input").value);

    plotTrajectory(lambda, T, steps);
    plotHistN(lambda, T, steps);
}

updateAll();

</script>
