// ==UserScript==
// @name         Two Level Access with Port Filtering INSIDE CKF
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Restrict script to specific ports, redirect to 404 on login error, and handle access levels.
// @author       You
// @match        http://192.168.200.202:8066/*
// @match        http://192.168.200.202:8066/404
// @match        http://192.168.200.202:8155/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Hentikan eksekusi skrip jika berada di port 8155
    if (window.location.port === '8155') {
        console.log("Script is disabled on port 8155.");
        return; // Stop execution
    }

    // Fungsi untuk menonaktifkan mouse
    function disableMouse() {
        document.body.style.pointerEvents = 'none';
    }

    // Fungsi untuk mengaktifkan mouse
    function enableMouse() {
        document.body.style.pointerEvents = 'auto';
    }

    // Fungsi untuk login
    function login() {
        let username = prompt("Enter username (admin or viewer):");
        let password = prompt("Enter password:");

        if (!username || !password) {
            // Jika username atau password kosong, arahkan ke halaman 404
            alert("Username or password cannot be empty. Redirecting to error page.");
            window.location.href = "http://192.168.200.202:8066/404";
            return;
        }

        if (username === "admin" && password === "P@ssw0rd_MOS!") {
            localStorage.setItem('user_role', 'admin');
            alert("Login successful as Administrator");

            // Setelah login berhasil, arahkan kembali ke halaman utama
            window.location.href = "http://192.168.200.202:8066";
        } else if (username === "viewer" && password === "viewer123") {
            localStorage.setItem('user_role', 'viewer');
            alert("Login successful as Viewer");

            // Setelah login berhasil, arahkan kembali ke halaman utama
            window.location.href = "http://192.168.200.202:8066";
        } else {
            // Jika username atau password salah, arahkan ke halaman 404
            alert("Invalid credentials. Redirecting to error page.");
            window.location.href = "http://192.168.200.202:8066/404";
        }
    }

    // Fungsi untuk logout
    function logout() {
        localStorage.removeItem('user_role');
        alert("You have logged out successfully.");
        location.reload();
    }

    // Menampilkan tombol logout di pojok kiri bawah
    function showLogoutButton() {
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.style.position = 'fixed';
        logoutButton.style.bottom = '20px';
        logoutButton.style.left = '20px'; // Pindahkan ke kiri bawah
        logoutButton.style.padding = '10px 20px';
        logoutButton.style.zIndex = '9999';
        logoutButton.style.backgroundColor = '#f00';
        logoutButton.style.color = '#fff';
        logoutButton.style.border = 'none';
        logoutButton.style.cursor = 'pointer';
        logoutButton.style.fontSize = '14px';

        logoutButton.style.pointerEvents = 'auto';
        logoutButton.addEventListener('click', logout);
        document.body.appendChild(logoutButton);
    }

    // Menampilkan level akses di bawah tombol logout (pojok kiri bawah)
    function showAccessLevel(level) {
        const accessLevelDiv = document.createElement('div');
        accessLevelDiv.textContent = `Access Level: ${level}`;
        accessLevelDiv.style.position = 'fixed';
        accessLevelDiv.style.bottom = '50px'; // Letakkan di bawah tombol logout
        accessLevelDiv.style.left = '20px'; // Tetap berada di kiri bawah
        accessLevelDiv.style.padding = '10px 20px';
        accessLevelDiv.style.backgroundColor = '#000';
        accessLevelDiv.style.color = '#fff';
        accessLevelDiv.style.borderRadius = '5px';
        accessLevelDiv.style.fontSize = '14px';
        accessLevelDiv.style.zIndex = '9999';

        document.body.appendChild(accessLevelDiv);
    }

    // Periksa apakah pengguna berada di halaman 404
    if (window.location.pathname === "/404") {
        alert("You are on the 404 error page. Please log in again.");
        login(); // Minta pengguna untuk login ulang
    } else {
        // Periksa apakah pengguna sudah login
        if (!localStorage.getItem('user_role')) {
            login();
        } else {
            let role = localStorage.getItem('user_role');
            if (role === 'admin') {
                enableMouse();
                alert("You are logged in as Administrator");
                showAccessLevel("Administrator");
                showLogoutButton();
            } else if (role === 'viewer') {
                disableMouse();
                alert("You are logged in as Viewer");
                showAccessLevel("Viewer");
                showLogoutButton();
            }
        }
    }
})();
