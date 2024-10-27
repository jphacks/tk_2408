import qrcode

# URL to encode into QR code
url = "https://vany.vercel.app/"

# Generate the QR code
qr_image = qrcode.make(url)
qr_image.show()