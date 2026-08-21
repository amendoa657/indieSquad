function protegerPagina() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
}

function fazerLogout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

protegerPagina();
