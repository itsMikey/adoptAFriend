import * as Speech from "ssml-builder";
import { AxiosPromise } from "axios";
import { APP_CONFIG } from "../common/AppConfig/AppConfig";
import { httpClient } from "../util/httpClient";
import { IApiShelter, IApiShelterResponse } from "../common/interfaces/api/IApiShelter";
import { IApiPetResponse, IApiPet } from "../common/interfaces/api/IApiPet";
import { AlexaObject } from "alexa-sdk";
import { IAlexaLocation } from "../common/interfaces/api/IAlexaLocation";
import { ISpeechCreation } from "../common/interfaces/ISpeechCreation";

class AdoptFriendService {

    public getShelters(postalCode: string): Promise<IApiShelterResponse> {
        return httpClient.doGet({
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                format: "json",
                key: APP_CONFIG.app.petFinder.apiKey,
                location: postalCode
            },
            url: `${APP_CONFIG.app.petFinder.url}shelter.find`
        });
    }

    public getPets(animalType: string, shelterId: string, offSet = 0) {
        return httpClient.doGet({
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                format: "json",
                id: shelterId,
                key: APP_CONFIG.app.petFinder.apiKey,
                offset: offSet,
                output: "full"
            },
            url: `${APP_CONFIG.app.petFinder.url}shelter.getPets`
        });
    }

    public async getUserPostalCode(url: string, accessToken: string, deviceId: string): Promise<IAlexaLocation> {
        return httpClient.doGet({
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            url: `${url}/v1/devices/${deviceId}/settings/address/countryAndPostalCode`
        });
    }

    public createPetDescription(pet: IApiPet) {
        return `Meet ${pet.name.$t}. ${pet.name.$t} is a ${(pet.sex.$t === "F") ? "female" : "male"} ${pet.breeds.breed.$t} located in ` +
            `${pet.contact.city.$t}. ${pet.name.$t} is ${pet.age.$t} and ready to be adopted today. `;
    }

    public async generatePetsResponse (animalType: string, shelterId: string, offSet = 0): Promise<ISpeechCreation>  {
        const pets: IApiPetResponse = await this.getPets(animalType, shelterId, offSet);
        
        const speech = new Speech();
        const animalMapper: any = {
            cats: "cat",
            dogs: "dog",
            cat: "cat",
            dog: "dog"
        };

        for (let pet of pets.petfinder.pets.pet) {
            // only read out requested animal type
            if (animalMapper[pet.animal.$t.toLowerCase()] === animalMapper[animalType.toLowerCase()] || animalType === "animals") {
                if (Object.keys(pet.description).length === 0) {
                    speech.say(this.createPetDescription(pet));
                    speech.pause("1s");
                } else {
                    speech.say(pet.description.$t);
                    speech.say(`${pet.name.$t} is available today at ${pet.contact.city.$t}.`)
                    speech.pause("1s");
                }
            }
        }

        speech.say("Would you like to meet more friends?")
        
        return {
            speech: speech.ssml(true),
            lastOffset: parseInt(pets.petfinder.lastOffset.$t)
        }
    }

    public generateSheltersSpeech(shelters: IApiShelter[]): string {
        const speech = new Speech();
        
        for (let shelter of shelters) {
            speech.say(`${shelter.name.$t} is located at `);
            speech.sayAs({
                word: `${shelter.address1.$t}, ${shelter.city.$t}, ${shelter.state.$t}`,
                interpret: "address"
            })
            speech.pause("1s");
        }
        return speech.ssml(true);
    }

}

export const adoptFriendService = new AdoptFriendService();

