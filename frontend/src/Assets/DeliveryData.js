export const DELIVERY_LOCATIONS = {
    Baringo: {
        baseDeliveryTime: "1 day",
        zones: ["Urban", "Rural", "Remote"],
        stages: [
          {
            name: "Kabarnet Town",
            fee: 500,
            peakFee: 1000,
            bulkDiscount: 150,
            estimatedTime: "1 days",
            instructions: "4x4 vehicle required during rainy season",
            landmarks: ["Kabarnet Museum", "County Offices"],
           
          },
       
        ]
      },
  
    Bomet: {
      baseDeliveryTime: "1day",
      zones: ["Township", "Rural Areas"],
      stages: [
        {
          name: "Bomet Town",
          fee: 700,
          peakFee: 850,
          bulkDiscount: 100,
          estimatedTime: "1 day",
          instructions: "Early morning deliveries preferred",
          landmarks: ["Bomet Green Stadium", "County Assembly"],
         
        },

      ]
    },
  
    Bungoma: {
      baseDeliveryTime: "1day",
      zones: ["Urban", "Peri-urban", "Rural"],
      stages: [
        {
          name: "Bungoma Town",
          fee: 600,
          peakFee: 750,
          bulkDiscount: 100,
          estimatedTime: "1 day",
          instructions: "Available 7am-7pm",
          landmarks: ["Bungoma State Lodge", "Kanduyi Stadium"],
        },
     
      ]
    },

  Busia: {
    baseDeliveryTime: "1day",
    zones: ["Border Town", "Interior"],
    stages: [

      {
        name: "Busia Town",
        fee: 700,
        peakFee: 850,
        bulkDiscount: 120,
        estimatedTime: "1 day",
        instructions: "Cross-border delivery available",
        landmarks: ["Busia Border", "Sofia Market"],
      
      
         },
     ]
    },
  "Elgeyo Marakwet" : {
    baseDeliveryTime: "1day",
    zones: ["Highland", "Valley"],
    stages: [
      {
        name: "Iten Town",
        fee: 200,
        peakFee: 950,
        bulkDiscount: 150,
        estimatedTime: "2 days",
        instructions: "Altitude considerations for sensitive items",
        landmarks: ["Kamariny Stadium", "County Offices"],
      
      },
    ]
},
  
      
        Kakamega: {
          baseDeliveryTime: "1day",
          zones: ["Urban", "Forest", "Rural"],
          stages: [
            {
              name: "Kakamega Town",
              fee: 800,
              peakFee: 950,
              bulkDiscount: 150,
              estimatedTime: "1 day",
              instructions: "Rainforest route considerations",
              landmarks: ["Kakamega Forest", "Golf Hotel"],
             
            }
          ]
        },
      
        Kericho: {
          baseDeliveryTime: "1day",
          zones: ["Tea Estates", "Urban", "Rural"],
          stages: [
            {
              name: "Kericho Town",
              fee: 750,
              peakFee: 900,
              bulkDiscount: 130,
              estimatedTime: "1 day",
              instructions: "Tea estate access protocols",
              landmarks: ["Tea Hotel", "Green Stadium"],
            
            }
          ]
        },
          
                Kisii: {
                  baseDeliveryTime: "1day",
                  zones: ["Urban", "Highland", "Tea Zones"],
                  stages: [
                    {
                      name: "Kisii Town",
                      fee: 700,
                      peakFee: 850,
                      bulkDiscount: 120,
                      estimatedTime: "1 day",
                      instructions: "Soapstone handling available",
                      landmarks: ["Gusii Stadium", "Kisii University"],
                    
                    }
                  ]
                },
              
                Kisumu: {
                  baseDeliveryTime: "Same day - 1 day",
                  zones: ["Lakeside", "CBD", "Industrial"],
                  stages: [
                    {
                      name: "CBD",
                      fee: 400,
                      peakFee: 500,
                      bulkDiscount: 100,
                      estimatedTime: "2-3 hours",
                      instructions: "Lake freight services available",
                      landmarks: ["Kisumu Port", "United Mall"],
                    
                    },
    
                  ]
                },
              
              
                                        Siaya: {
                                          baseDeliveryTime: "same day - 1 day",
                                          zones: ["Lakeside", "Urban", "Rural"],
                                          stages: [
                                            {
                                              name: "Siaya Town",
                                              fee: 700,
                                              peakFee: 850,
                                              bulkDiscount: 120,
                                              estimatedTime: "1 day",
                                              instructions: "Lake region access",
                                              landmarks: ["Siaya Stadium", "Got Ramogi"],
                                             
                                              specialServices: {
                                                lakeDelivery: true,
                                                ruralAccess: "Available",
                                                marketDaySchedule: "Flexible"
                                              }
                                            }
                                          ]
                                        },
                                      
                                            "Trans Nzoia": {
                                              baseDeliveryTime: "same day - 1 day",
                                              zones: ["Agricultural", "Urban", "Forest"],
                                              stages: [
                                                {
                                                  name: "Kitale",
                                                  fee: 500,
                                                  peakFee: 850,
                                                  bulkDiscount: 120,
                                                  estimatedTime: "1 day",
                                                  instructions: "Grain handling available",
                                                  landmarks: ["Kitale Museum", "ASK Showground"],
              
                                                  specialServices: {
                                                    grainTransport: true,
                                                    farmEquipment: "Handled",
                                                    bulkAgri: "Specialized"
                                                  }
                                                }
                                              ]
                                            },
                                          
                                            Turkana: {
                                              baseDeliveryTime: "1day",
                                              zones: ["Desert", "Lake", "Urban"],
                                              stages: [
                                                {
                                                  name: "Lodwar",
                                                  fee: 1000,
                                                  peakFee: 2500,
                                                  bulkDiscount: 300,
                                                  estimatedTime: "1 days",
                                                  instructions: "Desert-ready vehicles only",
                                                  landmarks: ["Lodwar Airstrip", "Lake Turkana"],
                                                  pickupPoints: ["Main Market", "Energy Centre"],
                                                  specialServices: {
                                                    desertNavigation: true,
                                                    lakeAccess: "Available",
                                                    oilFieldDelivery: "Specialized"
                                                  }
                                                }
                                              ]
                                            },
                                             "Uasin Gishu": {
baseDeliveryTime: "Same day - 1 day",
zones: ["Urban", "Agricultural", "Industrial"],
stages: [
  {
    name: "Eldoret CBD",
    fee: 0,  // Changed from 0o0 to 0
    peakFee: 650,
    bulkDiscount: 100,
    estimatedTime: "2-3 hours",
    instructions: "24/7 delivery available",
    landmarks: ["Eldoret Sports Club", "64 Stadium"],
    pickupPoints: ["Main Post Office", "Uganda Road"],  // Removed duplicate line
    specialServices: {
      expressDelivery: true,
      warehouseStorage: "Available",
      bulkGrain: "Handled"
    }
  },
  {
    name: "Outside Eldoret CBD",
    fee: 200,
    bulkDiscount: 120,
    estimatedTime: "1 day",
    instructions: "Rural access available",
    landmarks: ["Turbo Market", "Eldoret Airport"],
    specialServices: {
      ruralDelivery: true,
      marketDayService: "Enhanced",
      agriculturalProducts: "Handled"
    }
  }
                                                  ]
                                                },
                                              
                                                Vihiga: {
                                                  baseDeliveryTime: "1day",
                                                  zones: ["Highland", "Urban", "Rural"],
                                                  stages: [
                                                    {
                                                      name: "Mbale",
                                                      fee: 700,
                                                      peakFee: 850,
                                                      bulkDiscount: 120,
                                                      estimatedTime: "1 day",
                                                      instructions: "Tea zone access",
                                                      landmarks: ["County HQ", "Mbale Market"],
                                                      pickupPoints: ["Bus Park", "Rural Market"],
                                                      specialServices: {
                                                        ruralDelivery: true,
                                                        marketDayService: "Enhanced",
                                                        teaCollection: "Available"
                                                      }
                                                    }
                                                  ]
                                                },
                                            
                                                    "West Pokot": {
                                                      baseDeliveryTime: "1day",
                                                      zones: ["Highland", "Pastoral", "Urban"],
                                                      stages: [
                                                        {
                                                          name: "Kapenguria",
                                                          fee: 700,
                                                          peakFee: 1500,
                                                          bulkDiscount: 200,
                                                          estimatedTime: "1days",
                                                          instructions: "Mountain terrain vehicles required",
                                                          landmarks: ["Kapenguria Museum", "Freedom Square"],
                                                          pickupPoints: ["Main Stage", "County Offices"],
                                                          specialServices: {
                                                            mountainDelivery: true,
                                                            pastoralRoutes: "Mapped",
                                                            culturalEvents: "Supported"
                                                          }
                                                        }
]
 }
};
 export const TERRAIN_HANDLING = {
    desert: {
      vehicleType: "4x4 Specialized",
      waterStations: "Mapped",
      timeBuffer: "4 hours"
    },
    mountain: {
      altitudeConsideration: true,
      weatherMonitoring: "Real-time",
      alternativeRoutes: "Available"
    },
    border: {
      documentation: "Processed",
      customsClearance: "Handled",
      securityEscort: "Optional"
    },
                                                }
                                                  
                                                  export const FINAL_DELIVERY_FEATURES = {
                                                    nationwide: {
                                                      tracking: "Real-time GPS",
                                                      insurance: "Comprehensive",
                                                      support: "24/7 Helpline"
                                                    },
                                                    specialHandling: {
                                                      fragile: "Extra protection",
                                                      perishable: "Temperature controlled",
                                                      valuable: "Secured transport"
                                                    },
                                                    customerService: {
                                                      contact: "Multiple channels",
                                                      feedback: "Instant response",
                                                      resolution: "Priority handling"
                                                    }
                                                  };
                                                  
                                                  export const DELIVERY_ANALYTICS = {
                                                    performanceTracking: true,
                                                    routeOptimization: "AI-powered",
                                                    customerFeedback: "Real-time",
                                                    qualityMetrics: "ISO standards"
                                                  };
                                                  
                                              
                                              export const SPECIALIZED_ZONES = {
                                                aridRegions: {
                                                  vehicleRequirements: "Heavy duty",
                                                  waterStations: "Mapped",
                                                  securityProtocol: "Active"
                                                },
                                                borderPoints: {
                                                  documentation: "Handled",
                                                  customsClearance: "Available",
                                                  securityChecks: "Standard"
                                                }
                                              };
                                              

                                        
                                          
                                          export const EXTREME_WEATHER_SERVICES = {
                                            desertOperations: {
                                              vehicleType: "Heavy-duty 4x4",
                                              waterStations: "Mapped",
                                              satelliteTracking: "Active"
                                            },
                                            emergencySupport: {
                                              response: "24/7",
                                              alternativeRoutes: "Available",
                                              supplies: "Stocked"
                                            }
                                          };
                                          
                                      
                                      export const RIVER_DELTA_SERVICES = {
                                        waterTransport: {
                                          boatTypes: ["Speed", "Cargo", "Emergency"],
                                          tideSchedule: "Monitored",
                                          safetyEquipment: "Provided",
                                        },
                                        seasonalPlanning: {
                                          floodAlerts: true,
                                          alternativeRoutes: "Mapped",
                                          emergencyResponse: "24/7",

                                    },
                                }
                                  export const HIGHLAND_SERVICES = {
                                    weatherMonitoring: {
                                      realTime: true,
                                      alternativeRoutes: "Available",
                                      delayNotifications: "Instant",
                                    },
                                    specializedVehicles: {
                                      type: "All-terrain",
                                      capacity: "Variable",
                                      weatherProof: true
                                    }
                                  };
                              export const COASTAL_SERVICES = {
                                portDelivery: {
                                  customsClearance: true,
                                  documentation: "Handled",
                                  storage: "Available"
                                },
                                islandTransfer: {
                                  boatService: "Scheduled",
                                  ferryPriority: true,
                                  weatherMonitoring: "Active"
                                },
                            }
                      export const SECURITY_ZONES = {
                        border: {
                          clearance: "Required",
                          escort: "Available",
                          restrictions: "Apply"
                        },
                        urban: {
                          standard: "Normal operations",
                          nightDelivery: "Available"
                        },
                        rural: {
                          tracking: "Mandatory",
                          timeWindow: "Daylight only"
                        },
                    }
                      
                  
                  export const TRANSPORT_MODES = {
                    road: {
                      standard: "Available nationwide",
                      express: "Major towns only",
                      tracking: "Real-time GPS"
                    },
                    water: {
                      coastal: "Regular schedules",
                      lake: "On demand",
                      insurance: "Included"
                    },
                    specialized: {
                      mountainous: "4x4 vehicles",
                      desert: "All-terrain vehicles",
                      island: "Boat services"
                    },
                
                  
              };
              
              export const WEATHER_CONSIDERATIONS = {
                rainy_season: {
                  additionalTime: "2-3 hours",
                  alternativeRoutes: true,
                  specialPackaging: "Waterproof"
                },
                dry_season: {
                  earlyDelivery: "Recommended",
                  temperatureControl: true,
                  specialHandling: "Heat sensitive items"
                },
              
        };
          
          export const SPECIALIZED_SERVICES = {
            express: {
              availability: "Major towns only",
              timeGuarantee: "3 hours or free",
              tracking: "Real-time GPS"
            },
            bulk: {
              minimumWeight: "50kg",
              discountRate: "15%",
              advanceBooking: "24 hours"
            },
            fragile: {
              specialPackaging: true,
              insurance: "Included",
              handlingInstructions: "Provided"
            }
          };
          
      
      
      export const REGIONAL_FEATURES = {
        highland: {
          weatherConsiderations: true,
          specialVehicles: "4x4 capability",
          timeBuffer: "Additional 2 hours"
        },
        coastal: {
          humidityProtection: true,
          marineTransport: "Available",
          customsHandling: "For port deliveries"
        },
        arid: {
          temperatureControl: true,
          waterproofPackaging: "Standard",
          earlyDelivery: "Recommended"
        }
      };
  export const DELIVERY_SERVICES = {
    standard: {
      tracking: "24-hour updates",
      insurance: "Basic coverage",
      packaging: "Standard"
    },
    express: {
      tracking: "Real-time",
      insurance: "Premium coverage",
      packaging: "Enhanced protection"
    },
    premium: {
      tracking: "Real-time with dedicated agent",
      insurance: "Comprehensive coverage",
      packaging: "Custom protective solutions"
    }
  };
  

export const SPECIAL_HANDLING = {
    fragile: {
      surcharge: "15%",
      packaging: "Extra padding provided",
      insurance: "Available"
    },
    perishable: {
      coldChain: true,
      maxTransitTime: "8 hours",
      specialVehicles: "Refrigerated vans"
    },
    bulky: {
      weightLimit: "100kg",
      dimensionLimits: "2m x 2m x 2m",
      specialEquipment: "Required"
    }
  };
  
  export const SEASONAL_ADJUSTMENTS = {
    rainy: {
      affected_counties: ["Kisii", "Nyamira", "Kakamega"],
      surcharge: "20%",
      special_notes: "Weather-dependent delivery times"
    },
    holiday: {
      nationwide: true,
      surcharge: "15%",
      advance_booking: "Required"
    }
  };
  
  export const DELIVERY_RULES = {
    peakHours: {
      morning: {
        start: "07:00",
        end: "09:00",
        surcharge: 50
      },
      evening: {
        start: "17:00",
        end: "20:00",
        surcharge: 100
      }
    },
    bulkOrders: {
      minimum: 10000,
      discount: "10%",
      specialHandling: true
    },
    seasonalRates: {
      christmas: {
        surcharge: "15%",
        period: "Dec 15 - Dec 31"
      },
      blackFriday: {
        discount: "20%",
        period: "Last Friday of November"
      }
    }
  };
  