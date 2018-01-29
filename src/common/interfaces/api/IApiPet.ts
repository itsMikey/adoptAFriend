export interface IApiPetResponse {
    "@encoding": string;
    "@version": string;
    petfinder: {
        "@xmlns:xsi": string;
        lastOffset: {
            $t: string;
        },
        pets: {
            pet: IApiPet[];
        }
    }
}

export interface IApiPet {
    options?: any,
    status: {
        $t: string;
    },
    contact: {
        phone: {
            $t: string;
        },
        state: {
            $t: string;
        },
        email: {
            $t: string;
        },
        city: {
            $t: string;
        },
        zip: {
            $t: string;
        },
        address1: {
            $t: string;
        }
    },
    age: {
        $t: string;
    },
    size: {
        $t: string;
    },
    media?: {
        photos?: {
            photo?: [
                {
                    "@size": string;
                    $t: string;
                    "@id": string;
                },
                {
                    "@size": string;
                    $t: string;
                    "@id": string;
                },
                {
                    "@size": string;
                    $t: string;
                    "@id": string;
                },
                {
                    "@size": string;
                    $t: string;
                    "@id": string;
                },
                {
                    "@size": string;
                    $t: string;
                    "@id": string;
                }
            ]
        }
    },
    id: {
        $t: string;
    },
    shelterPetId: {
        $t: string;
    },
    breeds: {
        breed: {
            $t: string;
        }
    },
    name: {
        $t: string;
    },
    sex: {
        $t: string;
    },
    description: {
        $t: string;
    },
    mix: {
        $t: string;
    },
    shelterId: {
        $t: string;
    },
    lastUpdate: {
        $t: string;
    },
    animal: {
        $t: string;
    },
    [key: string]: any;
}

