import React, { useState, useEffect, useRef } from 'react';

const Stage11ActionButton = ({ 
  leadData,
  onComplete,
  getFieldLabel
}) => {
  console.log('🔵 Stage11ActionButton component rendered!');
  console.log('🔵 leadData received:', leadData);
  
  const [isLoading, setIsLoading] = useState(false);
  const hasCalledApi = useRef(false);

  // ← FIXED PHONE NUMBER for pass00 campaign
  const FIXED_PHONE_NUMBER = '8956835804'; // ← Clean 10-digit number only

  // ← Validation function
  const validateParameters = () => {
    const missingParams = [];
    
    const getLabel = (fieldKey) => {
      if (getFieldLabel && typeof getFieldLabel === 'function') {
        return getFieldLabel(fieldKey);
      }
      const fallbackLabels = {
        'parentsName': 'Parent Name',
        'kidsName': 'Student Name',
        'phone': 'Phone'
      };
      return fallbackLabels[fieldKey] || fieldKey;
    };
    
    if (!leadData?.parentsName || leadData.parentsName.trim() === '') {
      missingParams.push(getLabel('parentsName'));
    }
    if (!leadData?.kidsName || leadData.kidsName.trim() === '') {
      missingParams.push(getLabel('kidsName'));
    }
    if (!leadData?.phone || leadData.phone.trim() === '') {
      missingParams.push(getLabel('phone'));
    }
    
    console.log('🔍 Validation check:', {
      parentsName: leadData?.parentsName,
      kidsName: leadData?.kidsName,
      phone: leadData?.phone,
      missingParams
    });
    
    return missingParams;
  };

  // ← Clean phone number helper
  const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove +91 and any non-digit characters
    return phone.replace(/^\+91/, '').replace(/\D/g, '');
  };

  // ← API call for pass00 campaign to FIXED phone number
  const makePass00ApiCall = async () => {
    console.log('🟡 Making pass00 API call to FIXED phone number');
    
    try {
      // ← FIXED: No templateParams since campaign has none
      const requestBody = {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGYyOGY2ZTBjYzg1MGMwMmMzNGJiOCIsIm5hbWUiOiJXRUJVWlogRGlnaXRhbCBQcml2YXRlIExpbWl0ZWQiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjgwZjI4ZjZlMGNjODUwYzAyYzM0YmIzIiwiYWN0aXZlUGxhbiI6IkZSRUVfRk9SRVZFUiIsImlhdCI6MTc0NTgyMzk5MH0.pJi8qbYf3joYbNm5zSs4gJKFlBFsCS6apvkBkw4Qdxs',
        campaignName: 'pass00',
        destination: FIXED_PHONE_NUMBER, // ← Clean 10-digit number
        userName: 'Admin'
        // ← REMOVED templateParams - campaign has no parameters
      };

      console.log('📤 Request body (pass00 to fixed number):', requestBody);

      const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🟡 pass00 API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔴 pass00 API error:', errorText);
        throw new Error(`pass00 API failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('🟢 pass00 API Success:', result);
      console.log('📧 pass00 notification sent to fixed number successfully');
      
      return { success: true, result };

    } catch (error) {
      console.error('🔴 Error in pass00 API call:', error);
      return { success: false, error: error.message };
    }
  };

  // ← Main handler - Makes pass00 API call
  const handleApiCall = async () => {
    if (hasCalledApi.current) {
      console.log('🟡 API call already made, skipping...');
      return;
    }

    console.log('🟡 handleApiCall started - will make pass00 API call');
    console.log('🔍 Lead data validation:', leadData);

    // Validate required parameters
    const missingParams = validateParameters();
    if (missingParams.length > 0) {
      console.log('🔴 Missing required parameters:', missingParams);
      if (onComplete) {
        onComplete(false, `Missing required information: ${missingParams.join(', ')}`);
      }
      return;
    }
    
    hasCalledApi.current = true;
    setIsLoading(true);
    
    try {
      console.log('╔═════════════════════════════════════╗');
      console.log('  CALLING pass00 campaign to fixed    ');
      console.log('╚═════════════════════════════════════╝');
      
      const result = await makePass00ApiCall();
      
      console.log('╔═════════════════════════════════════╗');
      console.log('  pass00 API CALL COMPLETED           ');
      console.log('  Status:', result.success ? '✅ Success' : '❌ Failed');
      console.log('╚═════════════════════════════════════╝');

      // Notify parent component
      if (onComplete) {
        if (result.success) {
          onComplete(true);
        } else {
          onComplete(false, result.error);
        }
      }

    } catch (error) {
      console.error('🔴 Unexpected error in pass00 API call:', error);
      
      if (onComplete) {
        onComplete(false, error.message);
      }
    } finally {
      setIsLoading(false);
      console.log('🟡 handleApiCall finished');
    }
  };

  // ← Trigger API call when leadData is available
  useEffect(() => {
    console.log('🔵 useEffect triggered!');
    console.log('🔍 useEffect conditions:', {
      leadDataExists: !!leadData,
      hasCalledApi: hasCalledApi.current,
      shouldCall: leadData && !hasCalledApi.current
    });
    
    if (leadData && !hasCalledApi.current) {
      console.log('🔵 leadData exists and API not called yet, calling handleApiCall');
      
      // Call immediately without timeout
      handleApiCall();
    }
  }, [leadData]);

  // Component lifecycle logging
  useEffect(() => {
    console.log('🔵 Stage11ActionButton mounted');
    return () => {
      console.log('🔵 Stage11ActionButton unmounted');
    };
  }, []);

  // Invisible component
  return null;
};

export default Stage11ActionButton;
