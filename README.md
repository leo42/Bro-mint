# Bro-mint

This is an example of a dApp using the new Multisig Connector

Through this portal you can manage minting and buring of assets under the policy ID of your multisig wallet.

Simply connect with a multisig-enabled wallet and mint freely, the app will remember share atribures that you chose for any policy id you have used in the past. 

To Upload Images you will have to install IPFS on your local mashine *https://docs.ipfs.tech/install/ipfs-desktop/*, and allow CORS from mint.broclan.io (or your local url) by adding the following lines to your configuration. 

	"API": {
		"HTTPHeaders": {
			"Access-Control-Allow-Methods": [
				"PUT",
				"POST"
			],
			"Access-Control-Allow-Origin": [
				"https://mint.broclan.io",
				"https://webui.ipfs.io",
				"http://webui.ipfs.io.ipns.localhost:8081"
			]
		}
	},

