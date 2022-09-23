const {expect} = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let token

	beforeEach(async () => {
		// Fetch Token from contract with ethers js and then deploy it
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Dapp University', 'DAPP', '1000000')
	})

	describe('Deployment', () => {

		const name = 'Dapp University'
		const symbol = 'DAPP'
		const decimals = '18'
		const totalSupply = tokens('1000000')

		// Tests go inside here
		it('Has correct Name', async () => {
			// Check that name is correct
			expect(await token.name()).to.equal(name)
		})

		it('Has correct Symbol', async () => {
			// Check that the symbol name is correct
			expect(await token.symbol()).to.equal(symbol)
		})
		it('Has correct Decimals', async () => {
			// Check that the symbol name is correct
			expect(await token.decimals()).to.equal(decimals)
		})

		it('Has the correct Total Supply', async () => {
			//Test to validate
			//const value = tokens('1000000')
			//value = ethers.utils.parseUnits('1000000', 'ether')
			expect(await token.totalSupply()).to.equal(totalSupply)
		})
	})

}) 