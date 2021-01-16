import { Component } from '@angular/core';
import { Router, ActivatedRoute,NavigationExtras } from '@angular/router';
import { ServiceService } from './../servive/service.service';
import { Platform,NavController,LoadingController,ToastController, AlertController} from '@ionic/angular';

@Component({
  selector: 'app-detailorder',
  templateUrl: 'detailorder.page.html',
  styleUrls: ['detailorder.page.scss'],
})
export class DetailorderPage {

  order_id;
  partner_id:any;
  set_data:any;
  ParamQuery:any;
  dataform:any;
  orderDetail : boolean = false;

  nama;
  service_type;
  date_order;
  date_finish;
  alamat;
  status;
  photo;
  latitude;
  longitude;
  phone;
  qty;
  is_lazy : boolean = true

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private serviceService : ServiceService,
    public loadingController : LoadingController,
    public nav : NavController,
    private alertCtrl : AlertController
  ) {}
  ngOnInit() {
    // let dataStorage=JSON.parse(localStorage.getItem(this.TOKEN_KEY));
    if(this.router.getCurrentNavigation().extras.state)
    {
      this.order_id= this.router.getCurrentNavigation().extras.state.order_id;
    }
    else 
    {      
      this.order_id= this.route.snapshot.params.order_id;
      this.orderDetail = this.route.snapshot.params.order;
    }

    this.serviceService.CekUser().subscribe(data=>{
      this.set_data = data;
      this.partner_id = this.set_data.data.partner_id;
      if(this.partner_id===undefined||this.partner_id===null||this.partner_id===''){
        this.serviceService.logout();
      }
      this.setDetail(this.order_id);
    });
  }
  
  set;
  async setDetail(id){
    const loading = await this.loadingController.create({
      message : 'Please wait...'
    });

    // await loading.present();
    this.ParamQuery = {
      'order_id':id
    };
    this.serviceService.getOrder(this.ParamQuery, 'order_detail').subscribe(
      data => {
        console.log('res detail',data);
        
          this.dataform = data;
          if(this.dataform.status !== 'success') {
            // loading.dismiss();
            this.is_lazy = false
          }else{
            // loading.dismiss();
            this.is_lazy = false
            this.set = this.dataform.data[0];

            this.nama = this.set.nama;
            this.service_type = this.set.service_type;
            this.alamat = this.set.alamat;
            this.date_order = this.set.date_order;
            this.status = this.set.status;
            this.photo= "../../assets/images/"+this.set.photo;
            this.latitude = this.set.latitude;
            this.longitude = this.set.longitude;
            this.phone = this.set.phone;
            this.qty = this.set.qty;
          }
      },
      error => {
          loading.dismiss();
        }
    );
  }

  async goMap(lat, lon){
    let data_detail = {
      alamat : this.alamat,
      nama : this.nama,
      phone : this.phone,
      durasi : this.qty,
      status : this.status,
      service : this.service_type,
      order_id : this.order_id,
      customer_id : this.set.customer_id
    }

    let alert = await this.alertCtrl.create({
      header : 'Proses order',
      message : 'Anda yakin ingin proses order ini ?',
      buttons : [{
        text : 'Batal',
        role : 'cancel'
        },
        {
          text : 'Ya',
          handler : ()=>{
            this.updateOrder(this.order_id,this.set.partner_id)
            // this.nav.navigateForward(['marker',{lat : lat,long: lon, data : JSON.stringify(data_detail)}],);
          }
        }
      ]
    })
    alert.present();
   
    
    console.log('log lat',lat, lon);
    

  }

  updateOrder(order_id,partner_id){
    let param = {
      order_id : order_id,
      partner_id : partner_id,
      status : 'On Going'
      
    }
    this.serviceService.updateOrder(param, 'update-order').subscribe(
      data => {
        console.log('res update',data);
        
      },
      error => {
        console.log(error);
        }
    );
  }

  back() {
      this.router.navigate(['/indexmenu']);
  }

  async Varify() 
  {
    let alert = await this.alertCtrl.create({
      header : 'Perhatian.!',
      message : 'Dengan menekan tombol ini anda berarti sudah di lokasi client dan sudah selesai mengerjaka tugas ?',
      buttons : [{
        text : 'Ya',
        handler : ()=>{
          this.router.navigate(['/verifyorder', {order_id:this.order_id, partner_id : this.partner_id}]);
        }
      },
      {
        text : 'Tidak',
        role : 'cancle'
      }
    ]
      
    })
    alert.present()
    
  }

  async continue(lat,lon){
    let data_detail = {
      alamat : this.alamat,
      nama : this.nama,
      phone : this.phone,
      durasi : this.qty,
      status : this.status,
      service : this.service_type,
      order_id : this.order_id,
      customer_id : this.set.customer_id
    }
    let alert = await this.alertCtrl.create({
      header : 'Lanjutkan Order',
      message : 'Anda Akan Melanjutkan Order',
      buttons : [{
        text : 'Batal',
        role : 'cancel'
        },
        {
          text : 'Ya',
          handler : ()=>{
           
            this.nav.navigateForward(['marker',{lat : lat,long: lon, data : JSON.stringify(data_detail)}],);
          }
        }
      ]
    })
    alert.present();
  }
}
