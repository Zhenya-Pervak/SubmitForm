import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import axios from 'axios';


const name = /^[a-z]{3,15}$/i;
const password = /^[^\s]{5,128}$/i;
const email = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
const countryCode = ['UK', 'US'];

class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.defaultState = {
      countriesList: [],
      inputName: '',
      inputSurname: '',
      inputPassword: '',
      inputConfirmPassword: '',
      inputEmail: '',
      nameError: false,
      surnameError: false,
      passwordError: false,
      confirmPasswordError: false,
      emailError: false,
      countryError: false,
      country: null,
      requestError: false
    };

    this.state = {...this.defaultState};
  }

  async componentDidMount() {
    await axios.get('http://localhost:3002/countries').then(res => {
      this.setState({ countriesList: res.data });
    });
  }

  inputChange = (event) => {
    if (event.target.value.length === 0 || !name.test(event.target.value)) {
      this.setState({ inputName: event.target.value, nameError: true });
      return false;
    }
    this.setState({ inputName: event.target.value, nameError: false });
  };

  inputChangeSurname = (event) => {
    if (event.target.value.length === 0 || !name.test(event.target.value)) {
      this.setState({ inputSurname: event.target.value, surnameError: true });
      return false;
    }
    this.setState({ inputSurname: event.target.value, surnameError: false });
  };

  validatePasswordInput = (event) => {
    const { confirmPassword } = this.state;

    if(!password.test(event.target.value)) {
      this.setState({inputPassword: event.target.value, passwordError: true});
    } else if(event.target.value !== confirmPassword) {
      this.setState({inputPassword: event.target.value, passwordError: false, confirmPasswordError: true});
    } else if(event.target.value === confirmPassword) {
      this.setState({inputPassword: event.target.value, passwordError: false, confirmPasswordError: false});
    } else {
      this.setState({inputPassword: event.target.value, passwordError: false});
    }
  };

  validateConfirmPasswordInput = (event) => {
    const { inputPassword, passwordError } = this.state;
    if(!password.test(event.target.value) || (inputPassword.length === 0 && passwordError) || event.target.value !== inputPassword) {
      this.setState({inputConfirmPassword: event.target.value, confirmPasswordError: true});
      return false;
    }
    this.setState({ inputConfirmPassword: event.target.value, confirmPasswordError: false });
  };

  isEmail = addr => (
      email.test(addr)
  );

  validEmail = (event) => {
    this.isEmail(event.target.value) ? this.setState({
      inputEmail: event.target.value,
      emailError: false
    }) : this.setState({ inputEmail: event.target.value, emailError: true });
  };

  handleSelect = (event) => {
    this.state.countriesList.map((item) => {
      if(+item.id === +event.target.value){
        countryCode.indexOf(item.country_code) !== -1 ? this.setState({country: item, countryError: false}) : this.setState({country: item, countryError: true});
      }
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const {
      inputName,
      inputSurname,
      inputPassword,
      inputConfirmPassword,
      inputEmail,
      nameError,
      surnameError,
      passwordError,
      confirmPasswordError,
      emailError,
      countryError,
      country,
      countriesList
    } = this.state;

    if (!!inputName &&
        !!inputSurname &&
        !!inputPassword &&
        !!inputConfirmPassword &&
        !!inputEmail &&
        !nameError &&
        !surnameError &&
        !passwordError &&
        !confirmPasswordError &&
        !countryError &&
        !emailError) {

      this.postData({
        name: `${inputName} ${inputSurname}`,
        email: inputEmail,
        dialCode: country.dial_code,
        country: country.country_code,
        password: inputPassword,
        passwordConfirmation: inputConfirmPassword
      }).then(res => {
        console.log('response', res);
        this.setState({...this.defaultState, countriesList, country, requestError: false});
      }).catch((error) => {
        console.log('error', error);
        this.setState({...this.defaultState, countriesList, country, requestError: true});
      });
    }
  };

  postData = async (data) => {
     return await axios.post('http://localhost:3002/register', data);
  };

  render() {
    const { countriesList, inputName, inputSurname, nameError, surnameError, inputPassword, inputConfirmPassword, inputEmail, passwordError, confirmPasswordError, emailError, countryError, requestError } = this.state;
    return (
        <div className='container'>
          <h1>Submit From</h1>
          <div className={'formContainer'}>
            <form onSubmit={event => this.handleSubmit(event)}>
              <div className="userInfo">
                <section className='nameSection'>
                                <span className='nameBlock firstName'>
                                    <input type="text"
                                           value={inputName}
                                           placeholder='First name'
                                           onChange={event => {
                                             this.inputChange(event)
                                           }}/>
                                  {nameError ? <p>*Invalid input</p> : ''}
                                </span>
                  <span className='nameBlock surname'>
                                    <input type="text"
                                           value={inputSurname}
                                           placeholder='Surname'
                                           onChange={event => {
                                             this.inputChangeSurname(event)
                                           }}/>
                    {surnameError ? <p>*Invalid input</p> : ''}
                                </span>
                </section>

                <section className="countriesSection">
                  <select onChange={this.handleSelect} >
                    {
                      countriesList.map((item) => (
                          <option id={item.id}
                                  key={item.id}
                                  value={item.id}>
                            {item.name}
                          </option>
                      ))
                    }
                  </select>
                  {countryError ? <p>*Invalid country code, only UK or US</p> : ''}
                </section>

                <section className="email">
                  <input type="text"
                         placeholder='Email'
                         value={inputEmail}
                         onChange={event => this.validEmail(event)}
                  />
                  {emailError ? <p>*Invalid input</p> : ''}
                </section>

                <section className="password">
                  <input type="password"
                         placeholder='Password'
                         value={inputPassword}
                         onChange={event => {
                           this.validatePasswordInput(event)
                         }}/>
                  {passwordError ? <p>*Invalid input</p> : ''}
                </section>

                <section className="confirmPassword">
                  <input type="password"
                         placeholder='Confirm password'
                         value={inputConfirmPassword}
                         onChange={event => {
                           this.validateConfirmPasswordInput(event)
                         }}/>
                  {confirmPasswordError ? <p>*Invalid input</p> : ''}
                </section>

              </div>

              <section className="userInfoButton">
                <button>Submit</button>
                {requestError ? <p>*Request failed</p> : ''}
              </section>
            </form>
          </div>
        </div>
    );
  }
}

export default hot(module)(UserInfo)
