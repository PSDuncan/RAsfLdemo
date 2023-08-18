public with sharing class EnquiryController {
    @AuraEnabled
    public static String createEnquiryRecord(Map<String, Object> enquiryMap) {
        Enquiry__c newEnquiry = new Enquiry__c(
            FirstName__c = (String)enquiryMap.get('FirstName'),
            LastName__c = (String)enquiryMap.get('LastName'),
            Email__c = (String)enquiryMap.get('Email'),
            Country__c = (String)enquiryMap.get('Country'),
            Phone__c = (String)enquiryMap.get('Phone'),
            HolidayType__c = (String)enquiryMap.get('HolidayType'),
            NumberOfAdults__c = (Decimal)enquiryMap.get('NumberOfAdults'),
            NumberOfChildren__c = (Decimal)enquiryMap.get('NumberOfChildren'),
            ArrivalDate__c = (Date)enquiryMap.get('ArrivalDate'),
            DepartureDate__c = (Date)enquiryMap.get('DepartureDate'),
            Comments__c = (String)enquiryMap.get('Comments')
        );

        try {
            insert newEnquiry;
            return 'Success';
        } catch (Exception e) {
            // Handle exceptions and error logging
            return 'Error';
        }
    }

    @AuraEnabled
    public static Integer getEnquiryCounter() {
        EnquiryCounterSetting__c setting = EnquiryCounterSetting__c.getOrgDefaults();
        if (setting == null) {
            setting = new EnquiryCounterSetting__c();
            insert setting;
        }
        
        setting.LastUsedNumber__c++;
        update setting;
        
        return setting.LastUsedNumber__c;
    }
}
