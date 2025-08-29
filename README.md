# 🌍 CarbonImpact: Decentralized Carbon Footprint Platform

Welcome to CarbonImpact, a cutting-edge Web3 platform built on the Stacks blockchain using Clarity smart contracts! This project tackles climate change by empowering individuals to monitor, manage, and offset their carbon footprints with transparency and accountability. Users can log daily activities to calculate emissions, offset them through tokenized investments in verified renewable energy projects, and participate in a community-driven rewards system to promote sustainable living.

CarbonImpact improves upon traditional carbon offset systems by ensuring immutable, fraud-proof records of emissions and offsets, while offering tokenized stakes in real-world renewable projects like solar, wind, or reforestation initiatives. With gamified incentives and decentralized governance, CarbonImpact empowers users to make a measurable environmental impact while fostering a global community of eco-conscious individuals.

## ✨ Features

📈 **Track Emissions**: Log daily activities (e.g., transportation, energy consumption, food choices) to calculate your carbon footprint in real-time.  
🌱 **Offset with Confidence**: Purchase and redeem tokenized renewable energy credits, directly linked to verified green projects.  
🏆 **Earn Rewards**: Stake tokens to earn rewards for maintaining a low-carbon lifestyle or participating in governance decisions.  
🔍 **Transparent Verification**: Verify the authenticity of offsets and project impacts via blockchain records.  
🤝 **Community Governance**: Vote on new renewable projects to fund using platform tokens.  
🔐 **Immutable Records**: Ensure all carbon data and transactions are securely stored on the blockchain.  
🌐 **Global Impact**: Connect with a worldwide community to share sustainability tips and track collective progress.

## 🛠 How It Works

**For Users**  
- Log daily activities (e.g., miles driven, meals eaten) to calculate your carbon footprint using the `carbon-tracker` contract.  
- Purchase tokenized renewable credits via the `offset-marketplace` contract, tied to real-world green projects.  
- Redeem credits to offset emissions using the `offset-redeemer` contract, with immutable proof of impact.  
- Stake platform tokens in the `reward-staker` contract to earn incentives for sustainable habits.  
- Vote on new renewable projects using the `governance-voting` contract to shape the platform’s impact.  

**For Verifiers**  
- Use the `project-verifier` contract to check the legitimacy of renewable projects and their tokenized credits.  
- Access user carbon data and offset history via the `carbon-ledger` contract for transparency.  

**For Project Owners**  
- Register renewable projects (e.g., solar farms, wind turbines) via the `project-registry` contract to receive funding.  
- Issue tokenized credits backed by real-world impact through the `token-issuer` contract.

## 📜 Smart Contracts (8 Total)

Below is an overview of the 8 Clarity smart contracts powering CarbonImpact:

1. **carbon-tracker.clar**  
   Tracks user activities and calculates carbon footprints based on predefined emission factors (e.g., kg CO2 per mile driven).  
   - **Functions**:  
     - `log-activity`: Records user activities (e.g., travel, energy use) with emission data.  
     - `get-footprint`: Retrieves a user’s total carbon footprint over a specified period.  
     - `update-emission-factors`: Allows authorized admins to update emission factors based on new research.

2. **offset-marketplace.clar**  
   Facilitates the purchase and sale of tokenized renewable energy credits.  
   - **Functions**:  
     - `buy-credits`: Enables users to purchase credits using platform tokens.  
     - `list-credits`: Allows project owners to list available credits for sale.  
     - `get-market-data`: Retrieves current credit prices and availability.

3. **offset-redeemer.clar**  
   Handles the redemption of credits to offset user carbon footprints.  
   - **Functions**:  
     - `redeem-credits`: Burns credits to offset a user’s emissions, updating their footprint.  
     - `get-offset-history`: Returns a user’s offset history for transparency.

4. **reward-staker.clar**  
   Manages staking of platform tokens to reward low-carbon behavior.  
   - **Functions**:  
     - `stake-tokens`: Locks user tokens to participate in rewards.  
     - `claim-rewards`: Distributes rewards based on sustained low emissions.  
     - `get-stake-details`: Retrieves a user’s staked amount and reward eligibility.

5. **governance-voting.clar**  
   Enables token holders to vote on new renewable projects to fund.  
   - **Functions**:  
     - `propose-project`: Submits a new project for community voting.  
     - `vote-on-project`: Allows token holders to vote on proposed projects.  
     - `finalize-vote`: Closes voting and allocates funds to approved projects.

6. **project-registry.clar**  
   Registers and manages verified renewable energy projects.  
   - **Functions**:  
     - `register-project`: Adds a new project with details (e.g., location, type, expected impact).  
     - `update-project-status`: Updates project progress (e.g., funded, operational).  
     - `get-project-details`: Retrieves project information for users and verifiers.

7. **token-issuer.clar**  
   Issues and manages tokenized renewable credits backed by project impact.  
   - **Functions**:  
     - `issue-credits`: Creates new tokens for a verified project’s output (e.g., MWh of clean energy).  
     - `transfer-credits`: Transfers credits between users or to the marketplace.  
     - `burn-credits`: Removes redeemed credits from circulation.

8. **carbon-ledger.clar**  
   Maintains an immutable ledger of all user carbon data and offset transactions.  
   - **Functions**:  
     - `record-transaction`: Logs carbon-related transactions (e.g., emissions, offsets).  
     - `get-ledger-entry`: Retrieves transaction history for a user or project.  
     - `verify-transaction`: Confirms the integrity of a recorded transaction.

## 🚀 Getting Started

1. **Deploy Contracts**: Deploy the 8 Clarity smart contracts on the Stacks blockchain.  
2. **Set Up Emission Factors**: Initialize `carbon-tracker` with verified emission factors (e.g., 0.4 kg CO2 per mile for gasoline cars).  
3. **Register Projects**: Use `project-registry` to onboard verified renewable projects.  
4. **User Onboarding**: Users connect their Stacks wallet to log activities and purchase credits.  
5. **Offset and Stake**: Users offset emissions via `offset-redeemer` and stake tokens in `reward-staker` for rewards.  
6. **Community Voting**: Token holders propose and vote on projects via `governance-voting`.

## 🛠 Tech Stack

- **Blockchain**: Stacks (for Bitcoin-secured smart contracts)  
- **Smart Contract Language**: Clarity (secure, predictable, and auditable)  
- **Token Standard**: SIP-010 (fungible token standard for platform tokens and credits)  
- **Frontend (Optional)**: React or Vue.js for a user-friendly interface  
- **Wallet Integration**: Hiro Wallet for Stacks blockchain interaction

## 📚 Example Workflow

1. **Alice logs her commute**: She inputs 10 miles driven in a gas-powered car into `carbon-tracker`, which calculates 4 kg CO2.  
2. **Alice buys credits**: She purchases 4 tokenized credits from a solar project via `offset-marketplace`.  
3. **Alice offsets emissions**: She redeems the credits using `offset-redeemer`, reducing her footprint to 0.  
4. **Alice stakes tokens**: She stakes 100 platform tokens in `reward-staker` to earn rewards for her low-carbon week.  
5. **Bob verifies a project**: Bob uses `project-verifier` to confirm the solar project’s legitimacy before buying credits.  
6. **Community votes**: Token holders vote via `governance-voting` to fund a new wind farm project.

## 🌟 Why CarbonImpact?

- **Transparency**: Blockchain ensures all data is immutable and verifiable, eliminating greenwashing.  
- **Incentives**: Gamified rewards encourage sustainable habits.  
- **Impact**: Tokenized investments directly fund renewable projects with measurable outcomes.  
- **Community**: Decentralized governance empowers users to shape the platform’s future.  

Join CarbonImpact to track, offset, and celebrate your journey to a greener planet! 🌎