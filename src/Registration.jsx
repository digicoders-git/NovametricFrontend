import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OTPModal from './OTPModal';
import './Registration.css';

const Registration = () => {
  const initialFormState = {
    fullName: '',
    age: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    education: '',
    email: '',
    householdSize: '',
    maritalStatus: '',
    income: '',
    homeOwnership: '',
    employmentStatus: '',
    jobTitle: '',
    industry: '',
    experience: '',
    designation: '',
    orgSize: '',
    purchaseDecision: '',
    vehicle: '',
    dataConsent: '',
    nda: '',
    ageConfirm: '',
    communication: '',
    finalConsent: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitResponse, setSubmitResponse] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  const [sectionErrors, setSectionErrors] = useState({});
  const [currentSectionFields, setCurrentSectionFields] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
    "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
    "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
    "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
    "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
    "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
    "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
    "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const ageOptions = ['18–24', '25–34', '35–44', '45–54', '55+'];
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const householdOptions = ['1', '2', '3–4', '5 or more'];
  const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const homeOptions = ['Own', 'Rent'];
  const experienceOptions = ['0-1 year', '2-5 years', '6–10 years', '10+ years'];
  const purchaseOptions = ['Yes', 'No'];
  const vehicleOptions = ['Car', 'Two-Wheeler', 'None'];
  const yesNoOptions = ['Yes', 'No'];

  const industries = [
    "Agriculture", "Forestry", "Fishing", "Extraction / Mining", "Energy", "Oil & Gas", "Utilities",
    "Construction", "Electrical / Plumbing / HVAC", "Carpentry & Installations",
    "Maintenance Services (Landscaping, Snow Removal, etc.)", "Manufacturing",
    "Chemicals / Plastics / Rubber", "Consumer Packaged Goods (CPG)", "Printing & Publishing",
    "Food & Beverage Manufacturing", "Transportation", "Shipping / Distribution", "Wholesale",
    "Retail", "E-commerce", "Consumer Electronics", "Automotive (Sales/Service)", "Hospitality",
    "Tourism", "Personal Services (Housekeeping, Gardening, Child Care, etc.)", "Healthcare",
    "Animal Healthcare / Veterinary Medicine", "Bio-Tech / Pharmaceuticals", "Information Technology",
    "Computer Hardware", "Computer Software", "Telecommunications", "Internet",
    "Banking / Financial Services", "Insurance", "Architecture", "Engineering", "Legal Services",
    "Consulting (Management / Business Consulting)", "Accounting", "Real Estate",
    "Brokerage (Real Estate / Financial)", "Advertising & Public Relations", "Market Research",
    "Environmental Services", "Government / Public Sector", "Military", "Social Services",
    "Education", "Media", "Entertainment", "Communications", "Other"
  ];

  useEffect(() => {
    console.log('otpVerified state changed to:', otpVerified);
  }, [otpVerified]);

  useEffect(() => {
    if (justVerified) {
      const timer = setTimeout(() => {
        setJustVerified(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [justVerified]);

  useEffect(() => {
    if (formData.email && otpVerified) {
      setOtpVerified(false);
      setJustVerified(false);
    }
  }, [formData.email]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError('');
    // Clear field error when user starts typing
    if (sectionErrors[field]) {
      setSectionErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOTPVerificationSuccess = useCallback(() => {
    console.log('OTP verification successful, setting states');
    setOtpVerified(true);
    setJustVerified(true);
    setShowOTPModal(false);
    toast.success('Email verified successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const validateCurrentSection = () => {
    const errors = {};
    const requiredFields = [];

// required fields
    switch (currentSection) {
      case 0: // Basic Information
        requiredFields.push('fullName', 'age', 'gender', 'country', 'state', 'city', 'pincode', 'education');
        break;
      case 1: // Contact & Verification
        requiredFields.push('email');
        break;
      case 2: // Household Information
        requiredFields.push('householdSize', 'maritalStatus', 'income', 'homeOwnership');
        break;
      case 3: // Professional Background
        requiredFields.push('employmentStatus', 'industry', 'experience', 'designation', 'orgSize');
        break;
      case 4: // Lifestyle & Consumer Behavior
        requiredFields.push('purchaseDecision', 'vehicle');
        break;
      case 5: // Consent & Agreement
        requiredFields.push('dataConsent', 'nda', 'ageConfirm', 'communication');
        break;
    }

    // Validate each required field
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // Special validations
    if (currentSection === 0) {
      if (formData.pincode && !/^\d+$/.test(formData.pincode)) {
        errors.pincode = 'Pincode must contain only numbers';
      }
    }

    if (currentSection === 1) {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!otpVerified) {
        errors.emailVerification = 'Please verify your email before proceeding';
      }
    }

    setSectionErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextSection = () => {
    console.log('Next Section clicked');
    
    if (!validateCurrentSection()) {
      toast.error('Please fill all required fields before proceeding', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (currentSection === 1 && !otpVerified && !justVerified) {
      toast.warning('Please verify your email before proceeding.', {
        position: "top-right",
        autoClose: 3000,
      });
      setShowOTPModal(true);
      return;
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!otpVerified) {
      toast.warning('Please verify your email before submitting', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setShowOTPModal(true);
      return;
    }

    if (!formData.finalConsent) {
      toast.error('Please agree to the terms before submitting.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    if (formData.ageConfirm !== 'Yes') {
      toast.error('You must confirm you are 18 years or older.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    // Validate all sections
    for (let i = 0; i < sections.length; i++) {
      const requiredFields = [];
      switch (i) {
        case 0: requiredFields.push('fullName', 'age', 'gender', 'country', 'state', 'city', 'pincode', 'education'); break;
        case 1: requiredFields.push('email'); break;
        case 2: requiredFields.push('householdSize', 'maritalStatus', 'income', 'homeOwnership'); break;
        case 3: requiredFields.push('employmentStatus', 'industry', 'experience', 'designation', 'orgSize'); break;
        case 4: requiredFields.push('purchaseDecision', 'vehicle'); break;
        case 5: requiredFields.push('dataConsent', 'nda', 'ageConfirm', 'communication'); break;
      }

      for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          toast.error(`Please complete all sections before submitting. Missing: ${field}`, {
            position: "top-right",
            autoClose: 4000,
          });
          setCurrentSection(i);
          return;
        }
      }
    }

    // Validate pincode
    if (formData.pincode && !/^\d+$/.test(formData.pincode)) {
      toast.error('Pincode must contain only numbers', {
        position: "top-right",
        autoClose: 4000,
      });
      setCurrentSection(0);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Send separate location fields
      const payload = {
        ...formData,
        emailVerified: true,
        // location: `${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`,
      };

      const response = await fetch(`${API_URL}/api/registration/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setSubmitResponse(data);
      setShowSuccess(true);
      
      toast.success('Registration submitted successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('❌ Submission error:', error);
      setSubmitError(error.message || 'An error occurred. Please try again.');
      
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RadioOption = ({ name, value, checked, onChange, label }) => (
    <label className="radio-label">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required
      />
      <span>{label}</span>
    </label>
  );

  const sections = [
    {
      title: "Basic Information",
      number: 1,
      content: (
        <>
          <div className="form-group">
            <label>Full Name </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              required
              className={sectionErrors.fullName ? 'error' : ''}
            />
            {sectionErrors.fullName && <span className="field-error">{sectionErrors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Age </label>
            <div className="radio-group">
              {ageOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="age"
                  value={opt}
                  checked={formData.age === opt}
                  onChange={() => handleChange('age', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.age && <span className="field-error">{sectionErrors.age}</span>}
          </div>

          <div className="form-group">
            <label>Gender </label>
            <div className="radio-group">
              {genderOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="gender"
                  value={opt}
                  checked={formData.gender === opt}
                  onChange={() => handleChange('gender', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.gender && <span className="field-error">{sectionErrors.gender}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country </label>
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                required
                className={sectionErrors.country ? 'error' : ''}
              >
                <option value="">Select country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {sectionErrors.country && <span className="field-error">{sectionErrors.country}</span>}
            </div>

            <div className="form-group">
              <label>State </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="Enter state"
                required
                className={sectionErrors.state ? 'error' : ''}
              />
              {sectionErrors.state && <span className="field-error">{sectionErrors.state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter city"
                required
                className={sectionErrors.city ? 'error' : ''}
              />
              {sectionErrors.city && <span className="field-error">{sectionErrors.city}</span>}
            </div>

            <div className="form-group">
              <label>Pincode </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="Enter pincode"
                required
                className={sectionErrors.pincode ? 'error' : ''}
              />
              {sectionErrors.pincode && <span className="field-error">{sectionErrors.pincode}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Highest Level of Education </label>
            <select
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              required
              className={sectionErrors.education ? 'error' : ''}
            >
              <option value="">Select education level</option>
              <option value="less-high">Less than High School</option>
              <option value="high">High School / Diploma</option>
              <option value="grad">Graduate</option>
              <option value="postgrad">Postgraduate</option>
              <option value="doctorate">Doctorate</option>
            </select>
            {sectionErrors.education && <span className="field-error">{sectionErrors.education}</span>}
          </div>
        </>
      )
    },
    {
      title: "Contact & Verification",
      number: 2,
      content: (
        <>
          <div className="form-group">
            <label>Primary Email Address </label>
            <div className="email-verification">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={otpVerified}
                className={sectionErrors.email ? 'error' : ''}
              />
              <button
                type="button"
                onClick={() => {
                  if (!formData.email) {
                    toast.warning('Please enter your email address first', {
                      position: "top-right",
                      autoClose: 3000,
                    });
                    return;
                  }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(formData.email)) {
                    toast.warning('Please enter a valid email address', {
                      position: "top-right",
                      autoClose: 3000,
                    });
                    return;
                  }
                  setShowOTPModal(true);
                }}
                className={`verify-btn ${otpVerified ? 'verified' : ''}`}
                disabled={otpVerified || isSubmitting}
              >
                {otpVerified ? '✓ Verified' : 'Verify Email'}
              </button>
            </div>
            {sectionErrors.email && <span className="field-error">{sectionErrors.email}</span>}
            {sectionErrors.emailVerification && <span className="field-error">{sectionErrors.emailVerification}</span>}
            
            {otpVerified && (
              <p className="verification-success">
                ✓ Email verified successfully
              </p>
            )}
            {!otpVerified && formData.email && (
              <p className="verification-warning">
                ⚠ Email not verified. Click "Verify Email" to continue.
              </p>
            )}
          </div>
        </>
      )
    },
    {
      title: "Household Information",
      number: 3,
      content: (
        <>
          <div className="form-group">
            <label>How many people live in your household (including you)? </label>
            <div className="radio-group">
              {householdOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="household"
                  value={opt}
                  checked={formData.householdSize === opt}
                  onChange={() => handleChange('householdSize', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.householdSize && <span className="field-error">{sectionErrors.householdSize}</span>}
          </div>

          <div className="form-group">
            <label>Marital Status </label>
            <div className="radio-group">
              {maritalOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="marital"
                  value={opt}
                  checked={formData.maritalStatus === opt}
                  onChange={() => handleChange('maritalStatus', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.maritalStatus && <span className="field-error">{sectionErrors.maritalStatus}</span>}
          </div>

          <div className="form-group">
            <label>Annual Household Income </label>
            <select
              value={formData.income}
              onChange={(e) => handleChange('income', e.target.value)}
              required
              className={sectionErrors.income ? 'error' : ''}
            >
              <option value="">Select income range</option>
              <option value="0-25">$0 – $25,000</option>
              <option value="25-50">$25,000 – $50,000</option>
              <option value="51-100">$51,000 – $100,000</option>
              <option value="100-150">$100,000 – $150,000</option>
              <option value="150+">$150,000+</option>
            </select>
            {sectionErrors.income && <span className="field-error">{sectionErrors.income}</span>}
          </div>

          <div className="form-group">
            <label>Do you own or rent your home? </label>
            <div className="radio-group">
              {homeOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="home"
                  value={opt}
                  checked={formData.homeOwnership === opt}
                  onChange={() => handleChange('homeOwnership', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.homeOwnership && <span className="field-error">{sectionErrors.homeOwnership}</span>}
          </div>
        </>
      )
    },
    {
      title: "Professional Background",
      number: 4,
      content: (
        <>
          <div className="form-group">
            <label>Current Employment Status </label>
            <select
              value={formData.employmentStatus}
              onChange={(e) => handleChange('employmentStatus', e.target.value)}
              required
              className={sectionErrors.employmentStatus ? 'error' : ''}
            >
              <option value="">Select employment status</option>
              <option value="full">Employed Full-Time</option>
              <option value="part">Employed Part-Time</option>
              <option value="self">Self-Employed</option>
              <option value="student">Student</option>
              <option value="homemaker">Homemaker</option>
              <option value="retired">Retired</option>
              <option value="unemployed">Unemployed</option>
            </select>
            {sectionErrors.employmentStatus && <span className="field-error">{sectionErrors.employmentStatus}</span>}
          </div>

          <div className="form-group">
            <label>Job Title (if employed)</label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              placeholder="Your current job title"
            />
          </div>

          <div className="form-group">
            <label>Which industry do you work in? </label>
            <select
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              required
              className={sectionErrors.industry ? 'error' : ''}
            >
              <option value="">Select your industry</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            {sectionErrors.industry && <span className="field-error">{sectionErrors.industry}</span>}
          </div>

          <div className="form-group">
            <label>How many years of work experience do you have? </label>
            <div className="radio-group">
              {experienceOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="experience"
                  value={opt}
                  checked={formData.experience === opt}
                  onChange={() => handleChange('experience', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.experience && <span className="field-error">{sectionErrors.experience}</span>}
          </div>

          <div className="form-group">
            <label>Designation Level </label>
            <select
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              required
              className={sectionErrors.designation ? 'error' : ''}
            >
              <option value="">Select designation level</option>
              <option value="entry">Entry-Level</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior Management</option>
              <option value="director">Director / C-Suite</option>
            </select>
            {sectionErrors.designation && <span className="field-error">{sectionErrors.designation}</span>}
          </div>

          <div className="form-group">
            <label>How many employees work in your organization? </label>
            <select
              value={formData.orgSize}
              onChange={(e) => handleChange('orgSize', e.target.value)}
              required
              className={sectionErrors.orgSize ? 'error' : ''}
            >
              <option value="">Select organization size</option>
              <option value="<10">Less than 10</option>
              <option value="10-50">10–50</option>
              <option value="51-200">51–200</option>
              <option value="201-500">201–500</option>
              <option value="500-1000">500–1,000</option>
              <option value="1000-2500">1,000–2,500</option>
              <option value="2500+">2,500+</option>
            </select>
            {sectionErrors.orgSize && <span className="field-error">{sectionErrors.orgSize}</span>}
          </div>
        </>
      )
    },
    {
      title: "Lifestyle & Consumer Behavior",
      number: 5,
      content: (
        <>
          <div className="form-group">
            <label>Do you make purchase decisions for your household? </label>
            <div className="radio-group">
              {purchaseOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="purchase"
                  value={opt}
                  checked={formData.purchaseDecision === opt}
                  onChange={() => handleChange('purchaseDecision', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.purchaseDecision && <span className="field-error">{sectionErrors.purchaseDecision}</span>}
          </div>

          <div className="form-group">
            <label>Do you own a vehicle? </label>
            <div className="radio-group">
              {vehicleOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="vehicle"
                  value={opt}
                  checked={formData.vehicle === opt}
                  onChange={() => handleChange('vehicle', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.vehicle && <span className="field-error">{sectionErrors.vehicle}</span>}
          </div>
        </>
      )
    },
    {
      title: "Consent & Agreement",
      number: 6,
      content: (
        <>
          <div className="consent-box">
            <h3>NovaMetric Research – Official Participant Consent</h3>
            <div className="consent-content">
              <p>This survey is administered by <strong>NovaMetric Research Private Limited</strong> on behalf of our client. Please read the following terms carefully before participating.</p>
              
              <h4>1. Purpose of the Survey</h4>
              <p>The objective is to gather information for market research and analytical use only. All insights will be provided in aggregated or anonymized form.</p>
              
              <h4>2. Voluntary Participation & Withdrawal</h4>
              <p>Your participation is entirely voluntary. You may decline, skip questions, or exit at any time without penalty.</p>
              
              <h4>3. Data Privacy, Confidentiality & Security</h4>
              <p>We collect only necessary information. All data will be analyzed and reported in aggregated, anonymized format. Your identity will never be disclosed to the Client without explicit consent.</p>
              
              <h4>4. Your Rights as a Participant</h4>
              <p>You may withdraw at any point, request deletion of identifiable data, decline questions, or request clarification about data processing.</p>
              
              <h4>5. Liability Limitation</h4>
              <p>NovaMetric operates as a data collection and analysis partner. We are not liable for Client decisions based on survey outcomes or for damages from respondent-provided information.</p>
            </div>
          </div>

          <div className="form-group">
            <label>Do you consent to your data being used for research purposes only? </label>
            <div className="radio-group">
              {yesNoOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="consent1"
                  value={opt}
                  checked={formData.dataConsent === opt}
                  onChange={() => handleChange('dataConsent', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.dataConsent && <span className="field-error">{sectionErrors.dataConsent}</span>}
          </div>

          <div className="form-group">
            <label>Do you agree not to disclose any study-related information? </label>
            <div className="radio-group">
              {yesNoOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="nda"
                  value={opt}
                  checked={formData.nda === opt}
                  onChange={() => handleChange('nda', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.nda && <span className="field-error">{sectionErrors.nda}</span>}
          </div>

          <div className="form-group">
            <label>Are you 18 years or older? </label>
            <div className="radio-group">
              {yesNoOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="ageConfirm"
                  value={opt}
                  checked={formData.ageConfirm === opt}
                  onChange={() => handleChange('ageConfirm', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.ageConfirm && <span className="field-error">{sectionErrors.ageConfirm}</span>}
          </div>

          <div className="form-group">
            <label>Do you agree to receive communication regarding research opportunities? </label>
            <div className="radio-group">
              {yesNoOptions.map(opt => (
                <RadioOption
                  key={opt}
                  name="comm"
                  value={opt}
                  checked={formData.communication === opt}
                  onChange={() => handleChange('communication', opt)}
                  label={opt}
                />
              ))}
            </div>
            {sectionErrors.communication && <span className="field-error">{sectionErrors.communication}</span>}
          </div>

          <div className="final-consent">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.finalConsent}
                onChange={(e) => handleChange('finalConsent', e.target.checked)}
                required
              />
              <span>I have read, understood, and agree to all terms outlined above. I voluntarily consent to participate in this research.</span>
            </label>
          </div>
        </>
      )
    }
  ];

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentSection(0);
    setSubmitError('');
    setSubmitResponse(null);
    setShowSuccess(false);
    setOtpVerified(false);
    setJustVerified(false);
    setShowOTPModal(false);
    setSectionErrors({});
    
    toast.info('Form has been reset. You can start a new registration.', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  if (showSuccess) {
    return (
      <div className="success-container">
        <ToastContainer />
        <div className="success-box">
          <img src="/logo.png" alt="" className='reg-logo'/>
          <div className="success-icon">✓</div>
          <h2 className="success-title">Thank You!</h2>
          <p className="success-message">
            Your registration has been successfully submitted.
          </p>
          
          {submitResponse && (
            <div className="response-info">
              <p><strong>Name:</strong> {submitResponse.data?.fullName}</p>
              <p><strong>Email:</strong> {submitResponse.data?.email}</p>
              <p><strong>Submitted at:</strong> {new Date(submitResponse.data?.createdAt).toLocaleString()}</p>
              <p className="verification-success">
                ✓ Email verified successfully
              </p>
            </div>
          )}
          
          <p className="success-submessage">
            A confirmation email has been sent to your registered email address.
          </p>
          
          <div className="button-group">
            {/* <button 
              className="btn btn-info" 
              onClick={() => {
                console.log('=== VIEWING SUBMITTED DATA ===');
                console.log('Form Data:', formData);
                console.log('API Response:', submitResponse);
                toast.info('Data logged to console. Check developer tools.', {
                  position: "top-right",
                  autoClose: 3000,
                });
              }}
            >
              View Data in Console
            </button> */}
            {/* <button 
              className="btn btn-secondary" 
              onClick={resetForm}
            >
              Fill Another Form
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <header className="registration-header">
        <div className="logo">
          <img src="/logo.png" alt="" />
        </div>
        {/* <div className="subtitle">Panel Brief Questionnaire</div> */}
      </header>

      <OTPModal
        email={formData.email}
        showOTPModal={showOTPModal}
        setShowOTPModal={setShowOTPModal}
        API_URL={API_URL}
        onVerificationSuccess={handleOTPVerificationSuccess}
      />

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${((currentSection + 1) / sections.length) * 100}%`
          }}
        />
      </div>

      <div className="registration-content">
        {submitError && (
          <div className="error-alert">
            <span className="error-icon">⚠</span>
            <span>{submitError}</span>
          </div>
        )}

        <div className="section-indicator">
          Section {sections[currentSection].number} of {sections.length}
        </div>
        
        <h2 className="section-title">{sections[currentSection].title}</h2>
        
        <div className="section-content">
          {sections[currentSection].content}
        </div>

        <div className="button-group">
          {currentSection > 0 && (
            <button 
              className="btn btn-secondary" 
              onClick={prevSection}
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}
          {currentSection < sections.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={nextSection}
              disabled={isSubmitting}
            >
              Next Section
            </button>
          ) : (
            <button 
              className={`btn btn-primary ${isSubmitting ? 'submitting' : ''}`} 
              onClick={handleSubmit}
              disabled={isSubmitting || !otpVerified}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit Registration'
              )}
            </button>
          )}
        </div>
      </div>
        <footer className="registration-header">
        <p className='footer-text'>&copy; 2026 Novametric Research. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Registration;