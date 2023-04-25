import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../Services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../Models/user.model';

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
  public userIdToUpdate! : number ;
  public isUpdate : boolean =false;

  constructor(private fb:FormBuilder,
     private activatedRoute:ActivatedRoute,
     private router :Router,
     private api:ApiService,
     private toast:NgToastService) {

   }

  ngOnInit(): void {   /// Add validation later
    //adding to form group
    this.registrationForm = this.fb.group({
      firstName:[''],
      lastName:[''],
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
    });

    this.registrationForm.controls['height'].valueChanges.subscribe(data => {
      //after height is filled, sending to calculateBMI() for bmi calculation
      this.calculateBMI(data);
  });

    //getting id from activatedRoute
    this.activatedRoute.params
    .subscribe(params => {
    this.userIdToUpdate = params['id'];
    //sending id to api
    this.api.getRegisteredUserById(this.userIdToUpdate)
      .subscribe(res=>{
        // console.log(res);
        //sending API response to fill form
        this.isUpdate=true;
        this.fillFormForUpdate(res)
      })

    })

}

  submitRegistration(){
    console.log(this.registrationForm.value)
    this.api.postRegistration(this.registrationForm.value).subscribe(data=>{
    this.toast.success({detail:"Success",summary:"Enquiry Added",duration:3000});
    this.registrationForm.reset();
    })
  }

  updateRegistration(){
    console.log(this.registrationForm.value)
    this.api.updateRegisteredUser(this.registrationForm.value,this.userIdToUpdate).subscribe(data=>{
    this.toast.success({detail:"Success",summary:"Enquiry Updated",duration:3000});
    this.registrationForm.reset();
    this.router.navigate(['list'])
    })
  }


  calculateBMI(heightVal: number){
    const weight =this.registrationForm.value.weight
    const height=heightVal
    const BMI = weight/Math.sqrt(height)
    console.log(BMI)
    this.registrationForm.controls['bmi'].patchValue(BMI)
    switch(true){
      case BMI<18.5:
        this.registrationForm.controls['bmiResult'].patchValue("UnderWeight")
        break;
      case (BMI>=18.5 && BMI<25):
        this.registrationForm.controls['bmiResult'].patchValue("Normal")
        break;
      case (BMI>=25 && BMI<30):
        this.registrationForm.controls['bmiResult'].patchValue("OverWeight")
        break;
        default:
          this.registrationForm.controls['bmiResult'].patchValue("Obese")
        break;
    }
  }

  fillFormForUpdate(user:User){
    //receiving value from API and Binding to form
    this.registrationForm.setValue({

      firstName:user.firstName,
      lastName:user.lastName,
      email:user.email,
      mobile:user.mobile,
      weight:user.weight,
      height:user.height,
      bmi:user.bmi,
      bmiResult:user.bmiResult,
      gender:user.gender,
      trainerOption:user.trainerOption,
      package:user.package,
      important:user.important,
      gymHistory:user.gymHistory,
      enquiryDate:user.enquiryDate

    })
  }

}
