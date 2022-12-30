const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers, waffle } = require('hardhat');

describe('Attack', () => {
	it('Should change the owner of the Good contract', async () => {
		const AttackContract = await ethers.getContractFactory('Attack');
		const _attackContract = await AttackContract.deploy();
		await _attackContract.deployed();
		console.log("Attack Contract's Address", _attackContract.address);

		const goodContract = await ethers.getContractFactory('Good');
		const _goodContract = await goodContract.deploy(_attackContract.address, {
			value: ethers.utils.parseEther('3'),
		});
		await _goodContract.deployed();

		const [_, addr1] = await ethers.getSigners();
		let tx = await _goodContract.connect(addr1).addUserToList();
		await tx.wait();

		const eligible = await _goodContract.connect(addr1).isUserEligible();
		expect(eligible).to.equal(false);
	});
});
