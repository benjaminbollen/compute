// Copyright 2019 OpenST Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const BN = require('bn.js');

const { AccountProvider } = require('../test_lib/utils.js');
const Utils = require('../test_lib/utils.js');

const ProtocoreUtils = require('./utils.js');

const TestProtocore = artifacts.require('TestProtocore');

const config = {};

contract('Protocore::proposeLinkInternal', (accounts) => {
  const accountProvider = new AccountProvider(accounts);

  beforeEach(async () => {
    config.coconsensusAddress = accountProvider.get();

    config.epochLength = new BN(100);

    config.genesisKernelHeight = new BN(1);
    config.genesisKernelHash = Utils.getRandomHash();

    config.genesisParentVoteMessageHash = Utils.getRandomHash();
    config.genesisSourceTransitionHash = Utils.getRandomHash();
    config.genesisSourceBlockHash = Utils.getRandomHash();
    config.genesisTargetBlockHash = Utils.getRandomHash();
    config.genesisSourceBlockNumber = new BN(0);
    config.genesisTargetBlockNumber = new BN(config.epochLength);
    config.genesisVoteMessageHash = ProtocoreUtils.hashVoteMessage(
      config.genesisSourceTransitionHash,
      config.genesisSourceBlockHash,
      config.genesisTargetBlockHash,
      config.genesisSourceBlockNumber,
      config.genesisTargetBlockNumber,
    );
    config.genesisProposedMetablockHeight = new BN(1);

    config.protocore = await TestProtocore.new(
      config.coconsensusAddress,
      config.epochLength,
      config.genesisKernelHeight,
      config.genesisKernelHash,
      config.genesisParentVoteMessageHash,
      config.genesisSourceTransitionHash,
      config.genesisSourceBlockHash,
      config.genesisTargetBlockHash,
      config.genesisSourceBlockNumber,
      config.genesisTargetBlockNumber,
      config.genesisProposedMetablockHeight,
    );
  });

  contract('Negative Tests', async () => {
    it('', async () => {
      assert(true);
    });
  });

  contract('Positive Tests', async () => {
    it('should propose a valid link', async () => {
      const sourceTransitionHash = Utils.getRandomHash();
      const targetBlockHash = Utils.getRandomHash();
      const targetBlockNumber = config.genesisTargetBlockNumber.add(config.epochLength.muln(2));

      await config.protocore.proposeLink(
        config.genesisVoteMessageHash,
        sourceTransitionHash,
        targetBlockHash,
        targetBlockNumber,
      );

      const voteMessageHash = ProtocoreUtils.hashVoteMessage(
        sourceTransitionHash,
        config.genesisTargetBlockHash,
        targetBlockHash,
        config.genesisTargetBlockNumber,
        targetBlockNumber,
      );

      const actualParentVoteMessageHash = await config.protocore.getParentVoteMessageHash.call(
        voteMessageHash,
      );

      assert.strictEqual(
        actualParentVoteMessageHash,
        config.genesisVoteMessageHash,
      );

      const actualTargetBlockHash = await config.protocore.getTargetBlockHash.call(
        voteMessageHash,
      );

      assert.strictEqual(
        actualTargetBlockHash,
        targetBlockHash,
      );

      const actualTargetBlockNumber = await config.protocore.getTargetBlockNumber.call(
        voteMessageHash,
      );

      assert.isOk(
        actualTargetBlockNumber.eq(targetBlockNumber),
      );

      const actualSourceTransitionHash = await config.protocore.getSourceTransitionHash.call(
        voteMessageHash,
      );

      assert.strictEqual(
        actualSourceTransitionHash,
        sourceTransitionHash,
      );

      const actualProposedMetablockHeight = await config.protocore.getProposedMetablockHeight.call(
        voteMessageHash,
      );

      assert.isOk(
        actualProposedMetablockHeight.eq(config.genesisKernelHeight),
      );

      const actualForwardVoteCount = await config.protocore.getForwardVoteCount.call(
        voteMessageHash,
      );

      assert.isOk(
        actualForwardVoteCount.eqn(0),
      );

      const actualForwardVoteCountNextHeight = await config.protocore.getForwardVoteCountNextHeight.call(
        voteMessageHash,
      );

      assert.isOk(
        actualForwardVoteCountNextHeight.eqn(0),
      );

      const actualForwardVoteCountPreviousHeight = await config.protocore.getForwardVoteCountPreviousHeight.call(
        voteMessageHash,
      );

      assert.isOk(
        actualForwardVoteCountPreviousHeight.eqn(0),
      );

      const actualTargetFinalisation = await config.protocore.getTargetFinalisation.call(
        voteMessageHash,
      );

      assert.isOk(
        ProtocoreUtils.isRegistered(actualTargetFinalisation),
      );
    });
  });
});
