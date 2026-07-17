import Papa from "papaparse";
const API_URL = "/api/buoy"; // Vite の環境変数から API URL を取得

// API からデータを取得して表示するためのコード
const app = document.querySelector<HTMLDivElement>("#app");

interface SensorRow {
    sensorId: string;
    timestamp: string;
    battery: string;
    outsideTemp: string;
    waterTemp: string;
    DO_percent: string;
    DO_mgL: string;
}

async function fetchData(): Promise<string | null> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("データの取得に失敗しました:", error);
        return null;
    }
}

const renderTable = (data: string): string => {
    const parsed = Papa.parse(data, {
        header: false,
        skipEmptyLines: true
    });

    const namedData: SensorRow[] = parsed.data.map((row: any) => {
        // UTCの日時を、日本時間の読みやすい形式に変換する
        const utcDate = new Date(row[1]);
        const jstDateTime = utcDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

        return {
            sensorId: row[0],
            timestamp: jstDateTime, // 変換した日本時間を入れる
            battery: `${row[2]} V`,  // 単位「V」をつける
            outsideTemp: `${row[3]} ℃`, // 単位「℃」をつける
            waterTemp: `${row[4]} ℃`,   // 単位「℃」をつける
            DO_percent: `${row[5]} %`, // 単位「%」をつける
            DO_mgL: `${row[6]} mg/L`  // 単位「mg/L」をつける
        };
    });

    // 最新データが一番上にくるように並び順を逆にする
    namedData.reverse();

    let tableHtml = `
        <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
            <thead style="background-color: #e0f7fa;">
                <tr>
                    <th>センサID</th>
                    <th>日時</th>
                    <th>バッテリ電圧</th>
                    <th>外気温</th>
                    <th>水温</th>
                    <th>DO</th>
                    <th>DO</th>
                </tr>
            </thead>
            <tbody>
    `;

    namedData.forEach((row) => {
        tableHtml += `
            <tr>
                <td>${row.sensorId}</td>
                <td>${row.timestamp}</td>
                <td>${row.battery}</td>
                <td>${row.outsideTemp}</td>
                <td>${row.waterTemp}</td>
                <td>${row.DO_percent}</td>
                <td>${row.DO_mgL}</td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    return tableHtml;
};

if (app) {
    app.innerHTML = `
        <h2>DOセンサ（1号機）データ</h2>
        <div id="table-container">データを読み込み中...</div>
    `;
}

// API からデータを取得して表を反映
fetchData().then((data) => {
    if (app && data !== null) {
        const container = app.querySelector("#table-container");
        if (container) {
            container.innerHTML = renderTable(data);
        }
    } else if (app) {
        const container = app.querySelector("#table-container");
        if (container) {
            container.textContent = "データの取得に失敗しました。";
        }
    }
});