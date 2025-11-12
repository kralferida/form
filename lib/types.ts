export interface AccessCode {
  code: string
  createdAt: Date
  expiresAt: Date
  used: boolean
}

export interface VisaFormData {
  fullName: string
  previousSurnames: string
  maritalStatus: string
  dateOfBirth: string
  gender: string
  placeOfBirth: string
  nationality: string
  nationalId: string
  otherNationality: string
  foreignResidence: string
  phoneNumber: string
  previousUSVisit: string
  visaRejection: string
  homeAddress: string
  email: string
  passportNumber: string
  passportIssuingAuthority: string
  passportIssueDate: string
  passportExpiryDate: string
  usRelatives: string
  fatherInfo: string
  motherInfo: string
  occupation: string
  companyName: string
  companyAddress: string
  monthlyIncome: string
  jobStartDate: string
  jobDescription: string
  education: string
  languages: string
  countriesVisited: string
  militaryService: string
  previousVisaLocation: string
  fingerprintGiven: string
  passportLost: string
  visaLost: string
  previousSpouseInfo: string
  additionalInfo: string
  submittedAt: Date
}
