import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public trainerOptions = ['Yes', 'No'];  //Type not defined
  public genders = ["Male", 'Female']; //Type not defined and both '' and "" works
  public packages = ["Monthly", "Quarterly", "Yearly"] //Type not defined
  public importantList : string[] = [   // type defined and is best practice
    "Toxic Fat Reduction",
    "Energy and Endurance",
    "Building Lean Muscles",
    "Healthier Digestive System",
    "Sugar Craving Body",
    "Physical Fitness"
  ]

  public registrationForm!:FormGroup ; //! =? otherwise error

  constructor(private fb:FormBuilder) {

   }

  ngOnInit(): void {   /// Add validation later
    this.registrationForm = this.fb.group({
      firstName:[''],
      lasttName:[''],
      email:[''],
      mobile:[''],
      weight:[''],
      height:[''],
      bmi:[''],
      bmiResult:[''],
      gender:[''],
      trainerOption:[''],
      package:[''],
      important:[''],
      gymHistory:[''],
      enquiryDate:['']
    })
  }


  submitRegistration(){
    console.log(this.registrationForm.value)
  }


}
