import React, {Component} from 'react';
import axios from 'axios';
import {ToastAndroid, Picker, Text} from 'react-native';
import Dialog, {DialogContent, SlideAnimation, DialogTitle, DialogFooter, DialogButton} from 'react-native-popup-dialog';

const AZURE_API = 'https://pedway.azurewebsites.net/api';


export default class FeedbackView extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogTitle: 'Entrance Feedback',
      dialogVisibility: false,
      nodeID: '',
      selectedValue: '',
    };
    this.showDialog = this.showDialog.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  showDialog(nodeID) {
    this.setState({
      dialogVisibility: true,
      nodeID: nodeID,
      selectedValue: '',
    });
  }

  submitFeedback() {
    this.setState({
      dialogVisibility: false,
    });
    axios.post(AZURE_API + '/feedback',
        {
          'entranceId': this.state.nodeID,
          'message': 'Feedback Submitted via PedwayApp',
          'reported_status': this.state.selectedValue,
          'type': 'feedback',
        }
    ).then((res) => {
      if (res.status === 200) {
        ToastAndroid.showWithGravityAndOffset('Feedback Submitted', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 350);
      } else {
        ToastAndroid.showWithGravityAndOffset('Unable to Submit Feedback', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 350);
      }
    }).catch((e) => {
      ToastAndroid.showWithGravityAndOffset('Unable to Submit Feedback', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 350);
    });
  }

  render() {
    return (
      <Dialog
        visible={this.state.dialogVisibility}
        width={0.7}
        dialogTitle={<DialogTitle title={this.state.dialogTitle}/>}
        dialogAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        footer={
          <DialogFooter>
            <DialogButton
              text={'Cancel'}
              onPress={()=>{
                this.setState({
                  dialogVisibility: false,
                });
              }}
            />
            <DialogButton
              text={'Submit'}
              onPress={this.submitFeedback}
              disabled={this.state.selectedValue===''}
            />
          </DialogFooter>
        }
        onTouchOutside={() => {
        }}
      >
        <DialogContent>
          <Text>Submit feedback for this entrance's status:</Text>
          <Picker
            onValueChange={(val, idx) => {
              // resolve race condition
              setTimeout(()=> {
                this.setState({selectedValue: val});
              }, 15);
            }}
            selectedValue={this.state.selectedValue}
          >
            <Picker.Item label='Select entrance status' value=''/>
            <Picker.Item label='Open' value='open'/>
            <Picker.Item label='Closed' value='closed'/>
            <Picker.Item label='Closing' value='closing'/>
            <Picker.Item label='Dirty' value='dirty'/>
          </Picker>
        </DialogContent>
      </Dialog>);
  }
}
