function showToast(message, type = "info") {
    const colors = {
        success: "#16a34a",
        error: "#dc2626",
        info: "#878787"
    };

    Toastify({
        text: message,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        offset: { y: 20 },
        close: true,
        stopOnFocus: true,
        style: {
            background: colors[type] || colors.info,
            borderRadius: "12px",
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,.15)"
        }
    }).showToast();
}
// P.S. тут комментить не стал, итак вроде понятно.