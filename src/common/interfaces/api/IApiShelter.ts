export interface IApiShelterResponse {
    "@encoding": string;
    "@version": string;
    petfinder: {
        "@xmlns:xsi": string;
        lastOffset: {
            $t: string;
        };
        shelters: {
            shelter: IApiShelter[]
        };
        header: any;
    }
}

export interface IApiShelter {
    country: {
        $t?: string;
    };
    longitude: {
        $t?: string;
    },
    name: {
        $t?: string;
    },
    phone: {
        $t?: string;
    },
    state: {
        $t?: string;
    },
    email: {
        $t?: string;
    },
    city: {
        $t?: string;
    },
    zip: {
        $t?: string;
    },
    fax: {
        $t?: string;
    },
    latitude: {
        $t?: string;
    },
    id: {
        $t: string;
    },
    address1: {
        $t?: string;
    },
    address2: {
        $t?: string;
    },
    [key: string]: {
        $t?: string;
    };
}