# duo-extension
Browser extension for generating HOTP passcodes for Duo Security multi-factor authentication.

Compatible with Firefox and Chromium-based browsers (Chrome, Edge, etc.)

## Credits
- [Yusuf Bham](https://github.com/fifty-six/) for original Python Duo HOTP secret fetch and passcode generation script. You can find this script [here](https://gist.github.com/fifty-six/80fa6f9d18952ec21253fc10d1c9d548).

## Setup
1. Once you've installed the extension, sign in to your service and navigate to your Duo multi-factor authentication portal/page.

![enter image description here](https://i.imgur.com/ZOILCzR.png)

2. Select "Add a new device".

![enter image description here](https://i.imgur.com/W5MotY0.png)

3. Authenticate as your normally would, if prompted.
4. Select "Tablet" from the list of devices.

![enter image description here](https://i.imgur.com/VXGP5Wb.png)

5. Select "Android" from the list.

![enter image description here](https://i.imgur.com/Mi5YR46.png)

6. Press "I have Duo Mobile installed" if prompted.

![enter image description here](https://i.imgur.com/zTck6VU.png)

7. You will reach a screen with a QR code on it. At this point, open the extension from your browser's toolbar and press "Scan Page for Duo QR".

![enter image description here](https://i.imgur.com/kaPWXsA.png)

![enter image description here](https://i.imgur.com/WkUOwA6.png)

8. If you followed the steps correctly, the extension will notify you that scanning is complete. If it does not, please report an issue on the GitHub repository. At this point, setup is complete!

![enter image description here](https://i.imgur.com/7Msjxky.png)


## Usage

1. Using the extension after setup is very simple. Sign in to your intended service and navigate to your multi-factor authentication portal when you wish to log in.

![enter image description here](https://i.imgur.com/skbPQC1.png)

2. Click the extension's icon in your browser's toolbar. It should automatically log you in from there!

![enter image description here](https://i.imgur.com/tpSSXyI.png)

## Alternative

1. If the extension fails to automatically log you in by now, you can try pasting in your HOTP code manually. Click on the extension icon and copy the code displayed. Clicking it will automatically copy to clipboard.

![enter image description here](https://i.imgur.com/DdonWgC.png)

2. Paste the code into the Passcode authentication option and press "Log In". 

![enter image description here](https://i.imgur.com/BFyRMxC.png)

3. If this does not work, you can try generating a new code ("Generate new code" option in extension), reinstalling the extension and setting it up as a new device, or submitting an issue to the GitHub repository.
