import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import Address from "./Address.js";

import "./App.css";

//Methode cradou de React

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    addresses: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      //getting the events

      // let options = {
      //   fromBlock: 0, //Number || "earliest" || "pending" || "latest"
      //   toBlock: "latest",
      // };

      let options1 = {
        fromBlock: 0, //Number || "earliest" || "pending" || "latest"
      };

      //dataStored = nom de l'evenement à rechercher

      //Ici on recherche les past events:

      let listAddress = await instance.getPastEvents("dataStored", options1);
      console.log("listAddress =>", listAddress);

      //Puis on met à jour avec le listener:

      // instance.events
      //   .dataStored(options1)
      //   .on("data", (event) => listAddress.push(event));

      const response = await instance.methods.get().call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        storageValue: response,
        web3,
        accounts,
        contract: instance,
        addresses: listAddress,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runSet = async () => {
    const { accounts, contract } = this.state;
    let valeur = document.getElementById("valeur").value;
    const transac = await contract.methods
      .set(valeur)
      .send({ from: accounts[0] });
    const response = await contract.methods.get().call();

    //getting the events
    let options = {
      fromBlock: 0, //Number || "earliest" || "pending" || "latest"
      toBlock: "latest",
    };

    let listAddress = await contract.getPastEvents("dataStored", options);
    console.log("listAddress 2 =>", listAddress);

    // POUR S'AIDER A CREUSER DS LA Tx

    console.log("transac =>", transac);

    //

    console.log(
      "l'addresse est =>",
      transac.events.dataStored.returnValues._address
    );
    console.log("la data est =>", transac.events.dataStored.returnValues.data);

    this.setState({ storageValue: response, addresses: listAddress });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Address addr={this.state.accounts} />
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <div>The stored value is: {this.state.storageValue}</div>
        <p>Try changing the value by setting it via the input:</p>
        <div>
          <input type="text" id="valeur" />
          <button onClick={this.runSet}>set</button>
        </div>
        <br />
        <p>
          Here is the addresses that interacted with the contract, and the value
          they put
        </p>
        <table>
          {this.state.addresses.map((addresse, i) => (
            <tbody key={i}>
              <tr>
                <td>{addresse.returnValues._address}</td>
                <td>{addresse.returnValues.data}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    );
  }
}

export default App;
