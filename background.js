var QRError;

function validateQR(QRLink) {
    try {
        const QRUrl = new URL(QRLink);
    } catch (e) {
        console.log(QRLink);
        console.log(e);
        QRError(1);
    }
}