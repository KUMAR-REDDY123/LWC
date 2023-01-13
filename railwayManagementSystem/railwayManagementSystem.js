import { LightningElement,api,wire,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveDataFromRegisterForm from '@salesforce/apex/railwayManagementSystemHandler.saveDataFromRegisterForm';
import searchFromStation from '@salesforce/apex/railwayManagementSystemHandler.searchFromStation';
import searchToStation from '@salesforce/apex/railwayManagementSystemHandler.searchToStation';
import saveTrainDetail from '@salesforce/apex/railwayManagementSystemHandler.saveTrainDetail'
const Tocolumns = [{label:'To Station Name', fieldname:'To_Station__c'}]
const Fromcolumns = [{label:'From Station Name', fieldname:'From_Station__c'}]
export default class RailwayManagementSystem extends LightningElement
 {
    tocolumns = Tocolumns; 
    fromcolumns =Fromcolumns;
    loginForm = false;
    registerForm = false;
    planMyJourney = false;
    planMyJourney1 = false;
    name = false;
    contact = false;
    loginCredientials = false;
    showValidation;
    UserName
    Password
    Name
    Email
    PhoneNumber
    date
    fromWhichStation='';
    toWhichStation='';
   @track source=[];
   @track destination=[];
   @track date=[];
    handleOnRegister()
    {
        this.loginForm = true;
        this.name = true;
    }
    handleOnLoginForm()
    {
        this.planMyJourney = true;
    }
    handleOnExistingUser()
    {
        this.loginForm = false;
    }
    handleOnUserName(event)
    {
        this.UserName = event.target.value;
    }
    handleOnPassword(event)
    {
        this.Password = event.target.value;
        var lowerCaseLetter = /[a-z]/g;
        if(this.password.match(lowerCaseLetter))
        {
            this.template
            .querySelector('[data-id="letter"]')
                .classList.remove("invalid");
            this.template
            .querySelector('[data-id="letter"]')
                .classList.add("valid");
        }
        else 
        {
            this.template
            .querySelector('[data-id="letter"]')
                .classList.remove("valid");
            this.template
            .querySelector('[data-id="letter"]')
                .classList.add("invalid");
        }

        var upperCaseLetter = /[A-Z]/g;
        if(this.password.match(upperCaseLetter))
        {
            this.template
            .querySelector('[data-id="capital"]')
                .classList.remove("invalid");
            this.template
            .querySelector('[data-id="capital"]')
                .classList.add("valid");
        }
        else
        {
            this.template
            .querySelector('[data-id="capital"]')
                .classList.remove("valid");
            this.template
            .querySelector('[data-id="capital"]')
                .classList.add("invalid");
        }
        var length= /length>=8/g;
        if(this.password.match(length))
        {
            this.template
            .querySelector('[data-id="length"]')
                .classList.remove("invalid");
            this.template
            .querySelector('[data-id="length"]')
                .classList.add("valid");
        }
        else
        {
            this.template
            .querySelector('[data-id="length"]')
                .classList.remove("valid");
            this.template
            .querySelector('[data-id="length"]')
                .classList.add("invalid");
        }
        var numbers = /[0-9]/g;
        if(this.password.match(numbers))
        {
            this.template
            .querySelector('[data-id="number"]')
                .classList.remove("invalid");
            this.template
            .querySelector('[data-id="number"]')
                .classList.add("valid");
        }
        else
        {
            this.template
            .querySelector('[data-id="number"]')
                .classList.remove("valid");
            this.template
            .querySelector('[data-id="number"]')
                .classList.add("invalid");
        }
    }
    handleOnName(event)
    {
        this.Name = event.target.value;
    }
    handleOnEmail(event)
    {
        this.Email = event.target.value;
    }
    handleOnPhoneNumber(event)
    {
        this.PhoneNumber = event.target.value;
    }
    handleOnSave(event)
    {
        saveDataFromRegisterForm({userName:this.UserName, password:this.Password,name:this.Name,email:this.Email,phoneNumber:this.PhoneNumber})
        .then(result=>{
            this.toastEventFire('Success','Registered Successfully','success');
            this.planMyJourney = true;
            this.loginForm = false;
        })
        .catch(error=>{
            this.toastEventFire('Error','You need to enter all required Fields','error');
        })
    }
    hanleOnFromStation(event)
    {
        this.fromWhichStation = event.target.value;
        if(this.fromWhichStation)
        {
            searchFromStation({searchedValueFromStation:this.fromWhichStation}).then(result=>{
                this.source = JSON.stringify(result);               
                console.log('from',this.source)
                this.planMyJourney1 = true;
            })
            .catch(error=>{
                console.log('error',error);
            });
        }
        else
        {
            this.source=null;
        }
    }
    handleOnToStation(event)
    {
        this.toWhichStation = event.target.value;
        if(this.toWhichStation)
        {
            searchToStation({searchedValueToStation:this.toWhichStation}).then(result=>{
                this.destination = JSON.stringify(result);
                console.log('to',this.destination)
                this.planMyJourney1 = false;
            })
            .catch(error=>{
                console.log('error',error);
            });
        }
        else
        {
            this.destination=null;
        }
    }
    handleOnDate(event)
    {
        this.date = event.target.value;
    }
    handleOnSubmit()
    {
        saveTrainDetail({fromStation:this.source,toStation:this.destination,ticketDate:this.date}) 
        .then(result=>{
            this.toastEventFire('Success','Train details stored Successfully','success');            
        })
        .catch(error=>{
            this.toastEventFire('Error','You need to enter all required Fields','error');
        })
    }
    hanleOnReset()
    {
        //this.planMyJourney = true;
        this.planMyJourney = false;
    }

    handleFocus()
    {
        this.showValidation = true;
    }

    handleBlur()
    {
        this.showValidation = false;
    }

    handleAfterName()
    {
        this.name = false;
        this.contact = true;
    }
    handleForNameTab()
    {
        this.name = true;
        this.contact = false;
        this.loginCredientials = false;
    }
    handleForLoginCredientialTab()
    {
        this.name = false;
        this.contact = false;
        this.loginCredientials = true;
        
    }
    handleForContactInformationTab()
    {
        this.contact = true;
        this.name = false;
        this.loginCredientials = false;   
    }
    // Declaration of Toast Message
    toastEventFire(title,msg,variant,mode)
    {
        const e = new ShowToastEvent({
        title: title,
        message: msg,
        variant: variant,
        mode: mode
        });
        this.dispatchEvent(e);
    }


}