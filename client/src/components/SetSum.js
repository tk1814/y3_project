import React from "react";
class SetSum extends React.Component {
    
    state = { stackId: null};

    handleKeyDown1 = e => {
        // if the enter key is pressed, set the value with the string
        if (e.keyCode === 13) {
        this.setValue(e.target.value1);
        }
    };
    handleKeyDown2 = f => {
        // if the enter key is pressed, set the value with the string
        if (f.keyCode === 13) {
        this.setValue(f.target.value2);
        }
    };
    setValue = (value1, value2) => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Addition;
        // let drizzle know we want to call the `add` method with `value1 and value2`
        const stackId = contract.methods["add"].cacheSend(this.textInput1.value, this.textInput2.value, {
        from: drizzleState.accounts[0]
        });
        // save the `stackId` for later reference
        this.setState({ stackId });
    };

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.props.drizzleState;
        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId];
        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;
        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash].status}`;
    };

    render() {
        return (
        <div>
            <input type="number" ref={(input1) => this.textInput1 = input1} onKeyDown={this.handleKeyDown1} />
            <input type="number" ref={(input2) => this.textInput2 = input2} onKeyDown={this.handleKeyDown2} />
            <div>{this.getTxStatus()}</div>
        </div>
        );
    }
}
export default SetSum;