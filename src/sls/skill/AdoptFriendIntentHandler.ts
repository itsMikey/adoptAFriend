import * as Alexa from "alexa-sdk";
import { adoptFriendService } from "../../service/AdoptFriendService";
import { IApiShelter } from "../../common/interfaces/api/IApiShelter";
import { IApiPetResponse } from "../../common/interfaces/api/IApiPet";
import { IAlexaLocation } from "../../common/interfaces/api/IAlexaLocation";
import { ISpeechCreation } from "../../common/interfaces/ISpeechCreation";

export function handleAlexaIntents(event: any, context: any) {

    console.log("Request received:\n", JSON.stringify(event));

    const alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.ask.skill.ce485e6e-9a23-429a-ba41-32864eed0ac2";

    // set our session variables
    alexa.attributes = {
        ...alexa.attributes,
        offset: 0,
        shelters: [] as IApiShelter[],
        currentShelter: {
            index: 0,
            shelter: {} as IApiShelter
        }
    };

    const generatePetSpeech = async () => {
        const speechResponse: ISpeechCreation = await adoptFriendService.generatePetsResponse(event.request.intent.slots.animalType.value || "animals", alexa.attributes.currentShelter.shelter.id.$t, alexa.attributes.offset)
            .catch((err) => err);

        // check if we've reached the end of the animal list at this particular shelter
        if (!speechResponse.lastOffset) {
            alexa.attributes.currentShelter = alexa.attributes.shelters[++alexa.attributes.currentShelter.index];
            alexa.attributes.offset = 0;

            if (!alexa.attributes.currentShelter) {
                alexa.emit(":tell", "That's all the animals in your area");
            }

        } else {
            alexa.attributes.offset = speechResponse.lastOffset
        }

        alexa.emit(":ask", speechResponse.speech);
    };

    const handlers: any = {
        "LaunchRequest": () => {
            alexa.emit(':tell', 'Launching!');
        },
        "HelpIntent": () => {
            alexa.emit(":tell", "Hey, you can ask me to show you cats or dogs in the area. You can also ask me for shelters in the area");
        },
        "GetPets": async () => {
            // get location, then shelters
            const alexaLocation: IAlexaLocation = await adoptFriendService.getUserPostalCode(event.context.System.apiEndpoint,
                                                                                          event.context.System.apiAccessToken,
                                                                                          event.context.System.device.deviceId).catch((err) => err);

            const shelters: IApiShelter[] = await adoptFriendService.getShelters(alexaLocation.postalCode).then((res) => res.petfinder.shelters.shelter).catch((err) => err);

            // update session
            alexa.attributes.postalCode = alexaLocation.postalCode;
            alexa.attributes.shelters = shelters;
            alexa.attributes.currentShelter.shelter = shelters[0];


            generatePetSpeech();
        },
        "GetShelters": async () => {
            const alexaLocation: IAlexaLocation = await adoptFriendService.getUserPostalCode(event.context.System.apiEndpoint,
                event.context.System.apiAccessToken,
                event.context.System.device.deviceId).catch((err) => err);

            // error with location? exit out
            if (!alexaLocation.postalCode) {
                alexa.emit(":tell", "Sorry, there were no shelters in your area");
            }

            // get shelters and then generate speech
            const shelters: IApiShelter[] = await adoptFriendService.getShelters(alexaLocation.postalCode).then((res) => res.petfinder.shelters.shelter).catch((err) => err);
            const speech = adoptFriendService.generateSheltersSpeech(shelters);

            alexa.emit(":tell", speech);
        },
        "Amazon.YesIntent": async () => {
            generatePetSpeech();
        },
        "Amazon.NoIntent": () => {
            alexa.emit(":tell", "Hope you meet your new friend! Take care.")
        },
        "Unhandled": () => {
            alexa.emit(":tell", "Adopt a friend doesn't seem to understand");
        }
    }

    alexa.registerHandlers(handlers);
    alexa.execute();
}
