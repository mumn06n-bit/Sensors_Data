import Chart from "chart.js/auto";
import Papa from "papaparse";
import "./index.css";
import "./index.js"

function parseData(data: string) {
    const parsed = Papa.parse(data, {
        header: false,
        skipEmptyLines: true,
    });

    return parsed.data;
}

export function renderChart(
    data: string,
    sensorType: string,
    chartContainer: HTMLElement
) {
    if (!chartContainer) return;

    if (sensorType === "water") {
        chartContainer.innerHTML =
            `<div class="chart-legend">
                <span class="legend-item">
                    <span class="legend-color water-temp"></span>
                    水温
                </span>

                <span class="legend-item">
                    <span class="legend-color outside-temp"></span>
                    外気温
                </span>
            </div>
            <div class="chart-main">
                <div class="chart-y-axis">
                    <canvas id="salinity-y-axis"></canvas>
                </div>
                <div class="chart-scroll-area">
                    <div class="chart-wrapper">
                        <canvas id="water-chart"></canvas>
                    </div>
                </div>
            </div>`;

        renderWaterChart(data);
    }

    if (sensorType === "salinity") {
        chartContainer.innerHTML =
            ` <div class="chart-legend">
                <span class="legend-item">
                    <span class="legend-color water-temp"></span>
                    水温
                </span>

                <span class="legend-item">
                    <span class="legend-color outside-temp"></span>
                    外気温
                </span>
    
                <span class="legend-item">
                    <span class="legend-color salinity"></span>
                    塩分
                </span>
            </div>
            <div class="chart-main">
                <div class="chart-y-axis">
                    <canvas id="salinity-y-axis"></canvas>
                </div>
                <div class="chart-scroll-area">
                    <div class="chart-wrapper">
                        <canvas id="salinity-chart"></canvas>
                    </div>
                </div>
            </div>`;

        renderSalinityChart(data);
    }

    if (sensorType === "do1") {
        chartContainer.innerHTML =
            `<div class="chart-legend">
                <span class="legend-item">
                    <span class="legend-color water-temp"></span>
                    水温
                </span>

                <span class="legend-item">
                    <span class="legend-color outside-temp"></span>
                    外気温
                </span>
    
                <span class="legend-item">
                    <span class="legend-color do-percent"></span>
                    DO（%）
                </span>

                <span class="legend-item">
                    <span class="legend-color do-MgL"></span>
                    DO（mg/L）
                </span>
            </div>
            <div class="chart-main">
                <div class="chart-y-axis">
                    <canvas id="salinity-y-axis"></canvas>
                </div>
                <div class="chart-scroll-area">
                    <div class="chart-wrapper">
                        <canvas id="do1-chart"></canvas>
                    </div>
                </div>
            </div>`;

        renderDO1Chart(data);
    }

    if (sensorType === "do3") {
        chartContainer.innerHTML =
            `<div class="chart-legend">
                <span class="legend-item">
                    <span class="legend-color water-temp"></span>
                    水温
                </span>

                <span class="legend-item">
                    <span class="legend-color outside-temp"></span>
                    外気温
                </span>
    
                <span class="legend-item">
                    <span class="legend-color do-percent"></span>
                    DO（%）
                </span>

                <span class="legend-item">
                    <span class="legend-color do-MgL"></span>
                    DO（mg/L）
                </span>
            </div>
            <div class="chart-main">
                <div class="chart-y-axis">
                    <canvas id="salinity-y-axis"></canvas>
                </div>
                <div class="chart-scroll-area">
                    <div class="chart-wrapper">
                        <canvas id="do3-chart"></canvas>
                    </div>
                </div>
            </div>`;

        renderDO3Chart(data);
    }
}

const CHART_COLORS = {
    waterTemp: "#4FC3F7",
    outsideTemp: "#EF5350",
    salinity: "#ffb23e",
    doPercent: "#91ee96",
    doMgL: "#25852a",
};
// 水温グラフ
let waterChart: Chart | null = null;

function renderWaterChart(data: string) {
    const rows = parseData(data);

    const labels = rows.map((row: any) => {
        const date = new Date(row[1]);

        return date.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
        });
    });

    const waterTemps = rows.map((row: any) => {
        return Number(row[4]);
    });

    const outsideTemps = rows.map((row: any) => {
        return Number(row[3]);
    });

    const canvas = document.getElementById(
        "water-chart"
    ) as HTMLCanvasElement;

    const chartWidth = Math.max(
        rows.length * 20,
        800
    );
    canvas.width = chartWidth;
    canvas.height = 400;

    if (waterChart) {
        waterChart.destroy();
    }

    waterChart = new Chart(canvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [
                {
                    label: "水温",
                    data: waterTemps,
                    borderColor: CHART_COLORS.waterTemp,
                    backgroundColor: CHART_COLORS.waterTemp,
                    borderWidth: 2,
                },
                {
                    label: "外気温",
                    data: outsideTemps,
                    borderColor: CHART_COLORS.outsideTemp,
                    backgroundColor: CHART_COLORS.outsideTemp,
                    borderWidth: 2,
                },
            ],
        },

        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: "℃",
                    },
                },
            },
        },
    });
}

// 塩分グラフ
let salinityChart: Chart | null = null;

function renderSalinityChart(data: string) {
    const rows = parseData(data);

    // 横軸：日時
    const labels = rows.map((row: any) => {
        const date = new Date(row[1]);

        return date.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
        });
    });

    // 水温
    const waterTemps = rows.map((row: any) => {
        return Number(row[4]);
    });

    // 外気温
    const outsideTemps = rows.map((row: any) => {
        return Number(row[3]);
    });

    // 塩分
    const salinityValues = rows.map((row: any) => {
        return Number(row[6]);
    });

    const canvas = document.getElementById(
        "salinity-chart"
    ) as HTMLCanvasElement;

    // 縦横幅
    const chartWidth = Math.max(
        rows.length * 20,
        800
    );
    canvas.width = chartWidth;
    canvas.height = 400;

    // すでにグラフが存在していたら削除
    if (salinityChart) {
        salinityChart.destroy();
    }

    salinityChart = new Chart(canvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [
                {
                    label: "水温",
                    data: waterTemps,
                    borderColor: CHART_COLORS.waterTemp,
                    backgroundColor: CHART_COLORS.waterTemp,
                    borderWidth: 2,
                    yAxisID: "yTemp",
                },
                {
                    label: "外気温",
                    data: outsideTemps,
                    borderColor: CHART_COLORS.outsideTemp,
                    backgroundColor: CHART_COLORS.outsideTemp,
                    borderWidth: 2,
                    yAxisID: "yTemp",
                },
                {
                    label: "塩分",
                    data: salinityValues,
                    borderColor: CHART_COLORS.salinity,
                    backgroundColor: CHART_COLORS.salinity,
                    borderWidth: 2,
                    yAxisID: "ySalinity",
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                // 温度用の軸
                yTemp: {
                    display: false,
                },

                // 塩分用の軸
                ySalinity: {
                    display: true,
                    position: "left",

                    title: {
                        display: true,
                        text: "psu",
                    },

                    min: 29.5,
                    max: 34.5,
                },
            },
        },
    });
}

// DO1号グラフ
let do1Chart: Chart | null = null;

function renderDO1Chart(data: string) {
    const rows = parseData(data);

    const labels = rows.map((row: any) => {
        const date = new Date(row[1]);

        return date.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
        });
    });

    // 外気温
    const outsideTemps = rows.map((row: any) => {
        return Number(row[3]);
    });

    // 水温
    const waterTemps = rows.map((row: any) => {
        return Number(row[4]);
    });

    // DO(%)
    const doPercent = rows.map((row: any) => {
        return Number(row[5]);
    });

    // DO(mg/L)
    const doMgL = rows.map((row: any) => {
        return Number(row[6]);
    });

    const canvas = document.getElementById(
        "do1-chart"
    ) as HTMLCanvasElement;

    const chartWidth = Math.max(
        rows.length * 20,
        800
    );
    canvas.width = chartWidth;
    canvas.height = 400;

    // すでにグラフが存在していたら削除
    if (do1Chart) {
        do1Chart.destroy();
    }

    do1Chart = new Chart(canvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [
                {
                    label: "水温",
                    data: waterTemps,
                    borderColor: CHART_COLORS.waterTemp,
                    backgroundColor: CHART_COLORS.waterTemp,
                    borderWidth: 2,
                    yAxisID: "yTemp",
                },
                {
                    label: "外気温",
                    data: outsideTemps,
                    borderColor: CHART_COLORS.outsideTemp,
                    backgroundColor: CHART_COLORS.outsideTemp,
                    borderWidth: 2,
                    yAxisID: "yTemp",
                },
                {
                    label: "DO(%)",
                    data: doPercent,
                    borderColor: CHART_COLORS.doPercent,
                    backgroundColor: CHART_COLORS.doPercent,
                    borderWidth: 2,
                    yAxisID: "yDO",
                },
                {
                    label: "DO(mg/L)",
                    data: doMgL,
                    borderColor: CHART_COLORS.doMgL,
                    backgroundColor: CHART_COLORS.doMgL,
                    borderWidth: 2,
                    yAxisID: "yDOMgL",
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                // 温度用
                yTemp: {
                    display: false,
                },

                // DO(%)用
                yDO: {
                    display: true,
                    position: "left",

                    title: {
                        display: true,
                        text: "%",
                    },

                    min: 59,
                    max: 100,
                },

                // DO(mg/L)用
                yDOMgL: {
                    display: true,
                    position: "right",

                    title: {
                        display: true,
                        text: "mg/L",
                    },
                    min:3.5,
                    max:8,
                },
            },
        },
    });
}

// DO3号グラフ
let do3Chart: Chart | null = null;

function renderDO3Chart(data: string) {
    const rows = parseData(data);

    const labels = rows.map((row: any) => {
        const date = new Date(row[1]);

        return date.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
        });
    });

    // 外気温
    const outsideTemps = rows.map((row: any) => {
        return Number(row[3]);
    });

    // 水温
    const waterTemps = rows.map((row: any) => {
        return Number(row[4]);
    });

    // DO(%)
    const doPercent = rows.map((row: any) => {
        return Number(row[5]);
    });

    // DO(mg/L)
    const doMgL = rows.map((row: any) => {
        return Number(row[6]);
    });

    const canvas = document.getElementById(
        "do3-chart"
    ) as HTMLCanvasElement;

    const chartWidth = Math.max(
        rows.length * 20,
        800
    );
    canvas.width = chartWidth;
    canvas.height = 400;

    // すでにグラフが存在していたら削除
    if (do3Chart) {
        do3Chart.destroy();
    }

    do3Chart = new Chart(canvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [
                {
                    label: "水温",
                    data: waterTemps,
                    borderColor: CHART_COLORS.waterTemp,
                    backgroundColor: CHART_COLORS.waterTemp,
                    borderWidth: 2,
                    yAxisID: "yTemp",
                },
                {
                    label: "外気温",
                    data: outsideTemps,
                    borderColor: CHART_COLORS.outsideTemp,
                    backgroundColor: CHART_COLORS.outsideTemp,
                    borderWidth: 2,
                    yAxisID: "yTemp",
                },
                {
                    label: "DO(%)",
                    data: doPercent,
                    borderColor: CHART_COLORS.doPercent,
                    backgroundColor: CHART_COLORS.doPercent,
                    borderWidth: 2,
                    yAxisID: "yDO",
                },
                {
                    label: "DO(mg/L)",
                    data: doMgL,
                    borderColor: CHART_COLORS.doMgL,
                    backgroundColor: CHART_COLORS.doMgL,
                    borderWidth: 2,
                    yAxisID: "yDOMgL",
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                // 温度用
                yTemp: {
                    display: false,
                },

                // DO(%)用
                yDO: {
                    display: true,
                    position: "left",

                    title: {
                        display: true,
                        text: "%",
                    },

                    min: 59,
                    max: 100,
                },

                // DO(mg/L)用
                yDOMgL: {
                    display: true,
                    position: "right",

                    title: {
                        display: true,
                        text: "mg/L",
                    },
                    min:3.5,
                    max:8,
                },
            },
        },
    });
}