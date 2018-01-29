import * as chai from "chai";
import * as nock from "nock";
import { executeNocks, dummyAlexaTestObj, validPetSSML, validShelterSSML, generatedPetDescription } from "./AdoptFriendServiceMock";
import { adoptFriendService } from "../AdoptFriendService";
import { IApiShelterResponse, IApiShelter } from "../../common/interfaces/api/IApiShelter";
import { shelterMockObject, petsMockObject } from "./PetFinderApiObjects";
import { IApiPetResponse, IApiPet } from "../../common/interfaces/api/IApiPet";
import { IAlexaLocation } from "../../common/interfaces/api/IAlexaLocation";
import { testAppConfig } from "../../../test/testAppConfig";

const expect = chai.expect;

const mockedShelters: IApiShelter[] = shelterMockObject.petfinder.shelters.shelter;
const mockedPets: IApiPet[] = petsMockObject.petfinder.pets.pet;

describe("Adopt Friend Service should return data from API correctly", () => {
    executeNocks();
    it("should get shelters correctly", (done) => {

        adoptFriendService.getShelters(dummyAlexaTestObj.response.postalCode)
            .then((shelterRes: IApiShelterResponse) => {
                const shelters: IApiShelter[] = shelterRes.petfinder.shelters.shelter;

                for (let index in shelters) {
                    for (let key in shelters[index]) {
                        expect(mockedShelters[index][key], `shelter ${index}, (${shelters[index].name}) didn't equal ${key}`).to.eql(shelters[index][key])
                    }
                }
                done();
            })
            .catch((err) => {
                done(err);
            });

    });

    it("should get pets correctly", (done) => {
        adoptFriendService.getPets("cat", mockedShelters[0].id.$t, 0)
            .then((petRes: IApiPetResponse) => {

                const pets: IApiPet[] = petRes.petfinder.pets.pet;

                for (let index in pets) {
                    for (let key in pets) {
                        expect(mockedPets[index][key], `pet index ${index} (${pets[index][key]}) didn't match`).to.eql(pets[index][key])
                    }
                }
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should get alexa postal code correctly", (done) => {

        adoptFriendService.getUserPostalCode(dummyAlexaTestObj.url, dummyAlexaTestObj.accessToken, dummyAlexaTestObj.deviceId)
            .then((location: IAlexaLocation) => {
                expect(location.countryCode, "incorrect country code").to.eql(dummyAlexaTestObj.response.countryCode);
                expect(location.postalCode, "incorrect postal code").to.eql(dummyAlexaTestObj.response.postalCode);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
})

describe("Adopt Friend Service should generate speech correctly", () => {

    it("should generate pet speech", (done) => {
        executeNocks();
        adoptFriendService.generatePetsResponse("cat", mockedShelters[0].id.$t, 0)
            .then((speech) => {
                expect(speech.speech.replace(/\s/g, ''), "incorrect pet ssml").to.eql(validPetSSML.replace(/\s/g, ''));
                expect(speech.lastOffset.toString(), "incorrect offset").to.eql(petsMockObject.petfinder.lastOffset.$t);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should generate shelter speech", () => {
        const shelterSpeech:string = adoptFriendService.generateSheltersSpeech(mockedShelters)

        expect(shelterSpeech.replace(/\s/g, ''), "incorrect shelter ssml").to.eql(validShelterSSML.replace(/\s/g, ''));
    });

    it("should create a pet description", () => {
        const petDescription: string = adoptFriendService.createPetDescription(mockedPets[0]);

        expect(petDescription.replace(/\s/g, ''), "incorrect pet description").to.eql(generatedPetDescription.replace(/\s/g, ''));
        
    });
});