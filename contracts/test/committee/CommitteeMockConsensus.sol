pragma solidity >=0.5.0 <0.6.0;

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

import "../../committee/Committee.sol";
import "../../consensus/ConsensusInterface.sol";

contract CommitteeMockConsensus is ConsensusInterface {

    /* Storage */

    /** Precommits under consideration of committees. */
    mapping(address /* committee */ => bytes32 /* commit */) public decisions;


    /* External Functions */

    function registerCommitteeDecision(
        bytes32 /* _metachainId */,
        bytes32 _committeeDecision
    )
        external
    {
        require(
            decisions[msg.sender] == bytes32(0),
            "Committee's decision has been registered."
        );

        decisions[msg.sender] = _committeeDecision;
    }

    function reputation()
        external
        view
        returns (ReputationInterface)
    {
    }

    function coreValidatorThresholds()
        external
        view
        returns (uint256, uint256)
    {
    }

    function precommitMetablock(
        bytes32 /* _metachainId */,
        uint256 /* _metablockHeight */,
        bytes32 /* _metablockHashPrecommit */
    )
        external
    {
    }

    function newMetachain()
        external
        returns (
            bytes32 metachainId_,
            address anchor_,
            string memory mosaicVersion_,
            address consensusGateway_
        )
    {
    }

    function enterCommittee(
        address _committee,
        address _validator,
        address _furtherMember
    )
        external
    {
        Committee(_committee).enterCommittee(
            _validator,
            _furtherMember
        );
    }

    /**
     * @notice Get anchor address for metachain id.
     *
     * @return anchor_ Anchor address.
     */
    function getAnchor(bytes32)
        external
        returns (address anchor_)
    {
        anchor_ = address(1);
    }

}
