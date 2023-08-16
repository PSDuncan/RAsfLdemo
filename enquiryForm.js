import { LightningElement, wire, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import ENQUIRY_OBJECT from '@salesforce/schema/Enquiry__c';

const COUNTRY_OPTIONS = [
    { label: 'Australia (AU)', value: 'AU' },
    { label: 'United Kingdom (GB)', value: 'GB' },
    { label: 'United States of America (US)', value: 'US' }
];

const HOLIDAY_TYPE_OPTIONS = [
    { label: 'Value', value: 'Value' },
    { label: 'Standard', value: 'Standard' },
    { label: 'Luxury', value: 'Luxury' }
];

export default class EnquiryForm extends LightningElement {
    @track enquiry = {
        FirstName: '',
        LastName: '',
        Email: '',
        Country: '',
        Phone: '',
        HolidayType: '',
        NumberOfAdults: 0,
        NumberOfChildren: 0,
        ArrivalDate: '',
        DepartureDate: '',
        Comments: '',
        // Add other fields
    };

    countryOptions = COUNTRY_OPTIONS;
    holidayTypeOptions = HOLIDAY_TYPE_OPTIONS;

    submitEnquiry() {
        const fields = { ...this.enquiry };
        createRecord({ apiName: ENQUIRY_OBJECT.objectApiName, fields })
            .then(result => {
                if (result.id) {
                    this.postToRhinoAfricaAPI(this.enquiry);
                }
            })
            .catch(error => {
                // Handle errors and logging
            });
    }

    postToRhinoAfricaAPI(enquiry) {
        // Construct JSON payload and send POST request to Rhino Africa API
        const payload = this.generateJsonPayload(enquiry);
        // Perform POST request using fetch or XMLHttpRequest

        if (response.status !== 200) {
            // Handle API response errors and log
        }
    }

    generateJsonPayload(enquiry) {
        const payload = {
            FirstName: enquiry.FirstName,
            LastName: enquiry.LastName,
            Email: enquiry.Email,
            Country: enquiry.Country,
            Phone: enquiry.Phone,
            HolidayType: enquiry.HolidayType,
            NumberOfAdults: enquiry.NumberOfAdults,
            NumberOfChildren: enquiry.NumberOfChildren,
            ArrivalDate: enquiry.ArrivalDate,
            DepartureDate: enquiry.DepartureDate,
            Comments: enquiry.Comments,
            // Add other fields to payload
        };
        return JSON.stringify(payload);
    }
}
