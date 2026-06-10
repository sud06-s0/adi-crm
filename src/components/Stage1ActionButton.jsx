import React, { useState, useEffect, useRef } from 'react';

const Stage1ActionButton = ({ 
  leadData,
  onComplete,
  getFieldLabel // Field_key aware label function (optional)
}) => {
  console.log('🔵 Stage1ActionButton component rendered!');
  console.log('🔵 leadData received:', leadData);
  
  const [isLoading, setIsLoading] = useState(false);
  const hasCalledApi = useRef(false);

  // Fixed phone number for pass00 campaign
  const FIXED_PHONE_NUMBER = '8956835804';

  // Validation function
  const validateParameters = () => {
    const missingParams = [];
    
    const getLabel = (fieldKey) => {
      if (getFieldLabel && typeof getFieldLabel === 'function') {
        return getFieldLabel(fieldKey);
      }
      const fallbackLabels = {
        'phone': 'Phone',
        'parentsName': 'Parent Name',
        'kidsName': 'Student Name',
        'grade': 'Grade'
      };
      return fallbackLabels[fieldKey] || fieldKey;
    };
    
    if (!leadData?.phone || leadData.phone.trim() === '') {
      missingParams.push(getLabel('phone'));
    }
    if (!leadData?.parentsName || leadData.parentsName.trim() === '') {
      missingParams.push(getLabel('parentsName'));
    }
    if (!leadData?.kidsName || leadData.kidsName.trim() === '') {
      missingParams.push(getLabel('kidsName'));
    }
    if (!leadData?.grade || leadData.grade.trim() === '') {
      missingParams.push(getLabel('grade'));
    }
    
    console.log('🔍 Validation check:', {
      phone: leadData?.phone,
      parentsName: leadData?.parentsName,
      kidsName: leadData?.kidsName,
      grade: leadData?.grade,
      missingParams
    });
    
    return missingParams;
  };

  // API Call 1: Welcome text message to customer
  const makeWelcomeTextCall = async () => {
    console.log('🟡 Making API CALL 1 - welcome (text message)');
    
    try {
      const requestBody = {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGYyOGY2ZTBjYzg1MGMwMmMzNGJiOCIsIm5hbWUiOiJXRUJVWlogRGlnaXRhbCBQcml2YXRlIExpbWl0ZWQiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjgwZjI4ZjZlMGNjODUwYzAyYzM0YmIzIiwiYWN0aXZlUGxhbiI6IkZSRUVfRk9SRVZFUiIsImlhdCI6MTc0NTgyMzk5MH0.pJi8qbYf3joYbNm5zSs4gJKFlBFsCS6apvkBkw4Qdxs',
        campaignName: 'welcome',
        destination: leadData.phone,
        userName: leadData.parentsName,
        templateParams: [leadData.parentsName, leadData.kidsName, leadData.grade]
      };

      console.log('📤 Request body (text only):', requestBody);

      const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🟡 Welcome text API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔴 Welcome text API error:', errorText);
        throw new Error(`Welcome text API failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('🟢 Welcome text API Success:', result);
      console.log('📧 Welcome text message sent successfully');
      
      return { success: true, result };

    } catch (error) {
      console.error('🔴 Error in welcome text API call:', error);
      return { success: false, error: error.message };
    }
  };

  // API Call 2: Welcome PDF document to customer
  const makeWelcomeDocumentCall = async () => {
    console.log('🟡 Making API CALL 2 - welcome0000 (PDF document)');
    
    try {
      const requestBody = {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGYyOGY2ZTBjYzg1MGMwMmMzNGJiOCIsIm5hbWUiOiJXRUJVWlogRGlnaXRhbCBQcml2YXRlIExpbWl0ZWQiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjgwZjI4ZjZlMGNjODUwYzAyYzM0YmIzIiwiYWN0aXZlUGxhbiI6IkZSRUVfRk9SRVZFUiIsImlhdCI6MTc0NTgyMzk5MH0.pJi8qbYf3joYbNm5zSs4gJKFlBFsCS6apvkBkw4Qdxs',
        campaignName: 'welcome1000',
        destination: leadData.phone,
        userName: leadData.parentsName,
        templateParams: [leadData.parentsName],
        media: {
          url: 'https://candidschools.com/NOVA_Brochure.pdf',
          filename: 'NOVA_Brochure.pdf'
        }
      };

      console.log('📤 Request body (PDF document):', requestBody);

      const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🟡 Welcome document API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔴 Welcome document API error:', errorText);
        throw new Error(`Welcome document API failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('🟢 Welcome document API Success:', result);
      console.log('📄 Welcome PDF document sent successfully');
      
      return { success: true, result };

    } catch (error) {
      console.error('🔴 Error in welcome document API call:', error);
      return { success: false, error: error.message };
    }
  };

  // API Call 3: pass00 notification to fixed number
  const makePass00Call = async () => {
    console.log('🟡 Making API CALL 3 - pass00 (notification to fixed number)');
    console.log('🟡 Sending to fixed number:', FIXED_PHONE_NUMBER);
    
    try {
      const requestBody = {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGYyOGY2ZTBjYzg1MGMwMmMzNGJiOCIsIm5hbWUiOiJXRUJVWlogRGlnaXRhbCBQcml2YXRlIExpbWl0ZWQiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjgwZjI4ZjZlMGNjODUwYzAyYzM0YmIzIiwiYWN0aXZlUGxhbiI6IkZSRUVfRk9SRVZFUiIsImlhdCI6MTc0NTgyMzk5MH0.pJi8qbYf3joYbNm5zSs4gJKFlBFsCS6apvkBkw4Qdxs',
        campaignName: 'pass00',
        destination: FIXED_PHONE_NUMBER,
        userName: 'Admin'
        // No templateParams - campaign has none
      };

      console.log('📤 Request body (pass00):', requestBody);

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
      console.log('🔔 pass00 notification sent successfully');
      
      return { success: true, result };

    } catch (error) {
      console.error('🔴 Error in pass00 API call:', error);
      return { success: false, error: error.message };
    }
  };

  // Main handler - Makes all 3 API calls sequentially
  const handleApiCall = async () => {
    if (hasCalledApi.current) {
      console.log('🟡 API calls already made, skipping...');
      return;
    }

    console.log('🟡 handleApiCall started - will make 3 API calls');
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
      console.log('═══════════════════════════════════════════════════');
      console.log('STARTING 3 API CALLS SEQUENTIALLY');
      console.log('═══════════════════════════════════════════════════');

      // STEP 1: Make welcome text API call
      console.log('STEP 1: Calling welcome (text message)');
      const textResult = await makeWelcomeTextCall();
      
      if (!textResult.success) {
        console.warn('⚠️ Welcome text API failed, but continuing with other calls');
      }

      // STEP 2: Make welcome0000 document API call
      console.log('STEP 2: Calling welcome0000 (PDF document)');
      const documentResult = await makeWelcomeDocumentCall();
      
      if (!documentResult.success) {
        console.warn('⚠️ Welcome document API failed, but continuing with other calls');
      }

      // STEP 3: Make pass00 notification API call
      console.log('STEP 3: Calling pass00 (notification to fixed number)');
      const pass00Result = await makePass00Call();
      
      if (!pass00Result.success) {
        console.warn('⚠️ pass00 API failed');
      }

      // Report overall success
      const overallSuccess = textResult.success || documentResult.success || pass00Result.success;
      const errors = [];
      if (!textResult.success) errors.push(`Text: ${textResult.error}`);
      if (!documentResult.success) errors.push(`Document: ${documentResult.error}`);
      if (!pass00Result.success) errors.push(`pass00: ${pass00Result.error}`);

      console.log('═══════════════════════════════════════════════════');
      console.log('ALL 3 API CALLS COMPLETED');
      console.log('Welcome Text:', textResult.success ? '✅ Success' : '❌ Failed');
      console.log('Welcome Document:', documentResult.success ? '✅ Success' : '❌ Failed');
      console.log('pass00 Notification:', pass00Result.success ? '✅ Success' : '❌ Failed');
      console.log('═══════════════════════════════════════════════════');

      // Notify parent component
      if (onComplete) {
        if (overallSuccess) {
          onComplete(true);
        } else {
          onComplete(false, errors.join('; '));
        }
      }

    } catch (error) {
      console.error('🔴 Unexpected error in API calls:', error);
      
      if (onComplete) {
        onComplete(false, error.message);
      }
    } finally {
      setIsLoading(false);
      console.log('🟡 handleApiCall finished');
    }
  };

  // Trigger API calls when leadData is available
  useEffect(() => {
    console.log('🔵 useEffect triggered!');
    console.log('🔍 useEffect conditions:', {
      leadDataExists: !!leadData,
      hasCalledApi: hasCalledApi.current,
      shouldCall: leadData && !hasCalledApi.current
    });
    
    if (leadData && !hasCalledApi.current) {
      console.log('🔵 leadData exists and API not called yet, calling handleApiCall');
      
      setTimeout(() => {
        console.log('🔵 About to call handleApiCall after timeout');
        handleApiCall();
      }, 100);
    }
  }, [leadData]);

  // Component lifecycle logging
  useEffect(() => {
    console.log('🔵 Stage1ActionButton mounted');
    return () => {
      console.log('🔵 Stage1ActionButton unmounted');
    };
  }, []);

  // Invisible component
  return null;
};

export default Stage1ActionButton;
