const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let token, accounts, deployer, receiver

	beforeEach(async () => {
		// Fetch Token from contract with ethers js and then deploy it
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Dapp University', 'DAPP', '1000000')

		accounts = await ethers.getSigners()
		deployer = accounts[0]
		receiver = accounts[1]
	})

	describe('Deployment', () => {

		const name = 'Dapp University'
		const symbol = 'DAPP'
		const decimals = '18'
		const totalSupply = tokens('1000000')

		// Tests go inside here
		it('has correct Name', async () => {
			expect(await token.name()).to.equal(name)
		})

		it('has correct Symbol', async () => {
			expect(await token.symbol()).to.equal(symbol)
		})

		it('has correct Decimals', async () => {
			expect(await token.decimals()).to.equal(decimals)
		})

		it('has the correct Total Supply', async () => {
			//const value = tokens('1000000')
			//value = ethers.utils.parseUnits('1000000', 'ether')
			expect(await token.totalSupply()).to.equal(totalSupply)
		})

		it('assigns total supply to deployer', async () => {
			expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
		})
	})

	describe('Sending Tokens', () => {
		let amount, transaction, result

		describe('Success', () => {

			beforeEach(async () => {
				amount = tokens(100)
				//Transfer tokens (10:30 min mark note of signing when writing to blockchain)
				transaction = await token.connect(deployer).transfer(receiver.address, amount)
				result = await transaction.wait()
			})

			it('transfers token balances', async () => {
				// Log balance before transfer
				// console.log('deployer balance before transfer', await token.balanceOf(deployer.address))
				// console.log('receiver balance before transfer', await token.balanceOf(receiver.address))
		
				//Ensure that tokens were transferred (balance changed)
				expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
				expect(await token.balanceOf(receiver.address)).to.equal(amount)
				// Log balance after transfer
				// console.log('deployer balance after transfer', await token.balanceOf(deployer.address))
				// console.log('receiver balance after transfer', await token.balanceOf(receiver.address))
			})

			it('emits a transfer event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Transfer')
				
				const args = event.args
				expect(args.from).to.equal(deployer.address)
				expect(args.to).to.equal(receiver.address)
				expect(args.value).to.equal(amount)
			})
		})

		describe('Failure', async () => {

			it('rejects insufficient balances', async () => {
				//Transfer more tokens than deployer has - 100M
				const invalidAmount = tokens(100000000)
				await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
			})

			it('rejects invalid recipent', async () => {
				const amount = tokens(100)
				await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})
	})
})