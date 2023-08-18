import { LightningElement, track } from 'lwc';
import createEnquiryRecord from '@salesforce/apex/EnquiryController.createEnquiryRecord';
import getEnquiryCounter from '@salesforce/apex/EnquiryController.getEnquiryCounter';
import { createRecord } from 'lightning/uiRecordApi';

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

const LEAD_OBJECT_API_NAME = 'Lead';

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
        Comments: ''
    };

    @track enquiryCounter = 0;
    countryOptions = COUNTRY_OPTIONS;
    holidayTypeOptions = HOLIDAY_TYPE_OPTIONS;

    connectedCallback() {
        getEnquiryCounter()
            .then(counter => {
                this.enquiryCounter = counter;
            })
            .catch(error => {
                // Handle errors and logging
            });
    }

    submitEnquiry() {
        createEnquiryRecord({ enquiry: this.enquiry })
            .then(result => {
                if (result === 'Success') {
                    this.postToAPI();
                    this.createLead();
                }
            })
            .catch(error => {
                // Handle errors and logging
            });
    }

    postToAPI() {
        const apiEndpoint = 'https://eddy.rhinoafrica.com/submit';
        const initials = 'PD';
        const currentDateTime = new Date().toISOString().replace(/[-:.TZ]/g, '');

        this.enquiryCounter += 1; // Increment the counter

        const requestBody = {
            website_reference_number: `TST-${initials}-${currentDateTime}-${this.enquiryCounter.toString().padStart(8, '0')}`,
            first_name: this.enquiry.FirstName,
            last_name: this.enquiry.LastName,
            email: this.enquiry.Email,
            contact_number: this.enquiry.Phone,
            country: this.enquiry.Country,
            arrival_date: this.enquiry.ArrivalDate,
            departure_date: this.enquiry.DepartureDate,
            holiday_type: this.enquiry.HolidayType,
            adults: this.enquiry.NumberOfAdults,
            children: this.enquiry.NumberOfChildren,
            comments: this.enquiry.Comments,
            ed_website: '72',
            ed_passkey: 'devpass'
        };

        // Perform the API request using fetch
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa('ed_website:72' + ':' + 'ed_passkey:devpass')}`
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                // Handle success response
                console.log('API Request Successful');
            } else {
                // Handle error response
                console.error('API Request Failed:', data.message);
            }
        })
        .catch(error => {
            // Handle fetch error
            console.error('Fetch Error:', error);
        });
    }

    createLead() {
        const leadFields = {
            FirstName: this.enquiry.FirstName,
            LastName: this.enquiry.LastName,
            Company: 'Rhino Africa', // Adjust as needed
            Status: 'Open - Not Contacted', // Adjust as needed
            Email: this.enquiry.Email,
            Phone: this.enquiry.Phone,
            Description: this.enquiry.Comments
        };

        createRecord({ apiName: LEAD_OBJECT_API_NAME, fields: leadFields })
            .then(lead => {
                // Handle lead creation success
                console.log('Lead created successfully:', lead.id);
            })
            .catch(error => {
                // Handle lead creation error
                console.error('Error creating lead:', error);
            });
    }
}
