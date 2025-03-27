//const backendUrl = "https://flask-backend-cwc0.onrender.com/"; // 线上服务的 URL 地址）
const backendUrl = "http://127.0.0.1:5000"; // 后端服务的 URL（本地开发地址）

async function encryptData() {
const algorithm = document.getElementById("algorithm").value; // 获取算法选择
const data = document.getElementById("inputData").value; // 获取用户输入的数据
const key = document.getElementById("inputKey").value; // 获取用户输入的密钥

try {
    // 向后端发送 POST 请求
    const response = await fetch(`${backendUrl}/encrypt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // 请求头，表示数据类型为 JSON
    body: JSON.stringify({ algorithm, data, key }), // 请求体，发送的数据
    });

    const result = await response.json(); // 接收后端返回的响应
    if (response.ok) {
    // 将加密结果显示在页面上
    document.getElementById("output").innerText = `加密结果：${result.result}`;
    } else {
    document.getElementById("output").innerText = `错误：${result.error}  提示：${result.result}`;
    }
} catch (error) {
    document.getElementById("output").innerText = "请求失败，请检查网络！";
}
}

async function decryptData() {
const algorithm = document.getElementById("algorithm").value;
const data = document.getElementById("inputData").value;
const key = document.getElementById("inputKey").value;

try {
    const response = await fetch(`${backendUrl}/decrypt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ algorithm, data, key }),
    });
    const result = await response.json();
    if (response.ok) {
    document.getElementById("output").innerText = `解密结果：${result.result}`;
    } else {
    document.getElementById("output").innerText = `错误：${result.error}  提示：${result.result}`;
    }
} catch (error) {
    document.getElementById("output").innerText = "请求失败，请检查网络！";
}
}