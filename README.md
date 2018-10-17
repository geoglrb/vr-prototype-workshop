# Web VR Prototype Workshop

We've got a simple goal: we want to be able to write VR scenes on our laptops and be able to view them on our phones.

And we have a few extra criteria. We want:

- To instantly see the changes we make – in 5 seconds or less!
- To be able to make new VR projects quickly
- To publish our projects to the internet, so that we can access them anywhere and share them with other people.

To accomplish these, we need to spend 15 minutes getting a few things installed on our machines:

- A text editor: for writing the HTML and JavaScript for our VR scenes.
- A local web server: so that our laptops broadcast a URL to our phones, if both of them are on the same WiFi network. It's local, because it's on our machine. It's a server, because it serves us files at the URLs we request. It's a web server, because this all happens in a web browser.
- A terminal: so that we can issue the commands to our computer that will start our web server, and publish our projects to the internet. It's like time travelling back to the early 90s, before software had GUIs. So retro! You'll feel like Sandra Bullock in The Net.

Below is a guide for you to follow.

## Running WebVR with AFrame locally

In this first part, we'll get everything set up for you to serve web pages from your laptop to your phone.

### Step 1. Install VS code (optional)

This step is optional, if you have a code editor you favor. If you don’t please consider installing VS Code.

You can download it here: https://code.visualstudio.com/download

### Step 2. Install a terminal client

- Are you on a Mac or Linux? Great. It's already installed! And it’s called: Terminal.
  - You can find it in your applications folder.
- Are you on Windows? Use the Command Prompt
  - You can get to the CMD application by selecting `Win + R` keys on your keyboard. Then, type `cmd`

### Step 3. Install Node

Check if you need to install node with the following command in your terminal

- `node -v` \* If a version number is returned you have it installed, if not continue on to install node.

Node is a JavaScript runtime. What is a runtime? It's a piece of software that understands code you write in a specific language – in this case, the language is JavaScript. It powers a lot of websites you visit everyday, and is very easy to set up. You won't need to right anything for Node, but some of the other software we'll install requires it in order to run; for instance a command called NPM (node package manager). NPM allows you to install JavaScript based projects and run execute them on both personal and server based computers.

You can download it here: https://nodejs.org/en/

- Download the link with the subtitle "Recommended For Most Users".
- For the Mac a .pkg file for you to install
- For windows, an .exe file will be downloaded for you to install
- Open the folder you designed for your downloads, file the system appropriate file (pkg or exe) and double click the file to install Node and it’s helper applications
- You may need to restart your terminal application after installing
- Confirm the install with the following command
  - `node -v`
  - A version number should be returned.

### Step 4. Note your computer local ip address

- On mac; open terminal (if it’s not already)
- Issue one of the following commands:
  - 'ifconfig | grep inet'
  - Look for an ip address with 192.168.x.x number

* or -
  - `localip`
  - This will return your local ip address

- On windows; open cygwin
  - Issue the following command
  - `ipconfig`
  - Note the ip address under the ‘Local Area Connection’
  - It’s usually a 192.168.x.x number or a 10.0.0.x number

### Step 5. Install WebVR boilerplate software

1.  Copy the following file to https://github.com/cnewfeldt/webvr-workshop-2018/archive/master.zip from your browser
2.  Unzip and move webvr-workshop-2018-master to your systems Documents folder.
    - For mac: \* `~/Document/webvr-workshop-2018-master`
    - For windows:
      _ `/cygdrive/c/Users/COMPUTER_NAME/Documents/webvr-workshop-2018-master`
      _ Replace COMPUTER_NAME with the name of your computer
3.  Open up your terminal
4.  Issue the following commands:
    - For mac: \* `cd ~/Documents/webvr-workshop-2018`
    - For windows: \* `/cygdrive/c/Users/COMPUTER_NAME/Documents/webvr-workshop-2018`
    - Issue the following command:
      _ npm install
      _ The system will take a while to install.
      _ If you have a problem please call for assistance
      _ For windows:
      _ You may need to issue the following command if you get errors on the initial NPM install
      _ `npm install webpack-dev-server -g`
5.  After NPM has installed the WebVR boilerplate application you need to run it.
    - Issue the following command in the webvr_boilerplate folder \* `npm run dev`

### Step 6. Get ready to view the WebVR application on your mobile cardboard VR device

- Open the following URL to view running WebVR application
  _ For running on your local laptop: http://localhost:8080/
  _ You can use your mouse to move the view around to testing
  _ For running on your mobile VR device: http://your-computer-ip-address-from-step-4:8000
  _ Be sure to click on the goggles icon to put the software in to VR mode.

## Credits

Aframe has an amazing community of developers, here are the projects that are being used in WebVR Boilerplate:

- [Web VR Boilerplate](https://github.com/ianpetrarca/webvr_boilerplate)
- [Aframe](https://github.com/aframevr/aframe)
- [Aframe Environment](https://github.com/feiss/aframe-environment-component) by [Diego Goberna](http://feiss.be/)
- [Aframe Extras](https://github.com/donmccurdy/aframe-extras) by [Don McCurdy](https://www.donmccurdy.com/)
- [Aframe Physics](https://github.com/donmccurdy/aframe-physics-system) by [Don McCurdy](https://www.donmccurdy.com/)
- [Kframe](https://github.com/ngokevin/kframe/) by [Kevin Ngo](http://ngokevin.com/)
- [Aframe Teleport Component](https://github.com/fernandojsg/aframe-teleport-controls) by [Fernando Serrano](http://fernandojsg.com/blog/)
- [Aframe UI Widgets](https://github.com/caseyyee/aframe-ui-widgets) by [Casey Yee](https://twitter.com/whoyee?lang=en)
- [Super-Hands](https://github.com/wmurphyrd/aframe-super-hands-component) by [Will Murphy](https://social.coop/@datatitian)
