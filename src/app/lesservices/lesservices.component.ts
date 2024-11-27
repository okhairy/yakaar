import { Component, OnInit } from '@angular/core';
import { ArduinoDataService } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/services/arduino-data.service';  // Votre service pour les capteurs
import { ApiService } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/services/api.service';  // Votre service pour l'authentification et gestion des utilisateurs

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Variables pour stocker les données du capteur et de l'utilisateur
  temperatureData: any;
  humidityData: any;
  userInfo: any;

  constructor(
    private arduinoDataService: ArduinoDataService,  // Injection du service Arduino
    private apiService: ApiService  // Injection du service API
  ) {}

  ngOnInit(): void {
    // Appeler les méthodes pour récupérer les données des capteurs
    this.getTemperature();
    this.getHumidity();
    
    // Appeler la méthode pour récupérer les informations de l'utilisateur après authentification
    this.getUserInfo();
  }

  // Méthode pour récupérer la température
  getTemperature() {
    this.arduinoDataService.getTemperature().subscribe(data => {
      this.temperatureData = data;  // Stocker les données de la température dans la variable
    });
  }

  // Méthode pour récupérer l'humidité
  getHumidity() {
    this.arduinoDataService.getHumidity().subscribe(data => {
      this.humidityData = data;  // Stocker les données de l'humidité dans la variable
    });
  }

  // Méthode pour récupérer les informations de l'utilisateur
  getUserInfo() {
    const userId = '123'; // Exemple d'ID utilisateur, vous pouvez récupérer cela d'un service d'authentification
    this.apiService.getUserById(userId).subscribe(data => {
      this.userInfo = data;  // Stocker les informations de l'utilisateur dans la variable
    });
  }
}
