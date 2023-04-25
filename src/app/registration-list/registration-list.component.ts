import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../Models/user.model';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {

  public dataSource!:MatTableDataSource<User>;
  public user!:User[];
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email','mobile','bmiResult','gender','package','enquiryDate','action'];


  constructor(private api:ApiService,
    private router:Router,
    private toast:NgToastService,
    private confirm:NgConfirmService) { }
  getUsers(){
    this.api.getRegisteredUser().subscribe(data=>{
      this.user = data;
      this.dataSource=new MatTableDataSource(this.user);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id:number){
    this.router.navigate(['update',id])
  }

  deleteRegistration(id:number){
    this.confirm.showConfirm("Are You Sure??",()=>{
      this.api.deleteRegisteredUser(id).subscribe(data=>{
      this.toast.success({detail:'Success',summary:'Deleted Successfully',duration:3000});
      this.getUsers();
      })
    },
    ()=>{

    })

  }

  ngOnInit(): void {
    this.getUsers();
  }

}
