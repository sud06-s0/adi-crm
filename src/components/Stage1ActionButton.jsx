import React, { useState, useEffect, useRef } from 'react';

const Stage1ActionButton = ({
  leadData,
  onComplete,
  getFieldLabel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const hasCalledApi = useRef(false);

  const FIXED_PHONE_NUMBER = '9875346683';

  const validateParameters = () => {
    const missingParams = [];

    const getLabel = (fieldKey) => {
      if (getFieldLabel && typeof getFieldLabel === 'function') {
        return getFieldLabel(fieldKey);
      }

      const fallbackLabels = {
        phone: 'Phone',
        parentsName: 'Parent Name',
        kidsName: 'Student Name',
        grade: 'Grade'
      };

      return fallbackLabels[fieldKey] || fieldKey;
    };

    if (!leadData?.phone?.trim()) {
      missingParams.push(getLabel('phone'));
    }

    if (!leadData?.parentsName?.trim()) {
      missingParams.push(getLabel('parentsName'));
    }

    if (!leadData?.kidsName?.trim()) {
      missingParams.push(getLabel('kidsName'));
    }

    if (!leadData?.grade?.trim()) {
      missingParams.push(getLabel('grade'));
    }

    return missingParams;
  };

  // Welcome School Message
  const makeWelcomeSchoolCall = async () => {
    try {
      const requestBody = {
        apiKey:
          'YOUR_AISENSY_API_KEY',
        campaignName: 'welcome-school',
        destination: leadData.phone,
        userName: leadData.parentsName,
        templateParams: [
          leadData.parentsName,
          leadData.kidsName,
          leadData.grade
        ]
      };

      const response = await fetch(
        'https://backend.aisensy.com/campaign/t1/api/v2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `welcome-school failed: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      return {
        success: true,
        result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Admin Notification
  const makePass00Call = async () => {
    try {
      const requestBody = {
        apiKey:
          'YOUR_AISENSY_API_KEY',
        campaignName: 'pass00',
        destination: FIXED_PHONE_NUMBER,
        userName: 'Admin'
      };

      const response = await fetch(
        'https://backend.aisensy.com/campaign/t1/api/v2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `pass00 failed: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      return {
        success: true,
        result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const handleApiCall = async () => {
    if (hasCalledApi.current) return;

    const missingParams = validateParameters();

    if (missingParams.length > 0) {
      onComplete?.(
        false,
        `Missing required information: ${missingParams.join(', ')}`
      );
      return;
    }

    hasCalledApi.current = true;
    setIsLoading(true);

    try {
      // API 1
      const welcomeResult = await makeWelcomeSchoolCall();

      // API 2
      const pass00Result = await makePass00Call();

      const overallSuccess =
        welcomeResult.success || pass00Result.success;

      const errors = [];

      if (!welcomeResult.success) {
        errors.push(`Welcome School: ${welcomeResult.error}`);
      }

      if (!pass00Result.success) {
        errors.push(`Pass00: ${pass00Result.error}`);
      }

      if (overallSuccess) {
        onComplete?.(true);
      } else {
        onComplete?.(false, errors.join('; '));
      }
    } catch (error) {
      onComplete?.(false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (leadData && !hasCalledApi.current) {
      setTimeout(() => {
        handleApiCall();
      }, 100);
    }
  }, [leadData]);

  return null;
};

export default Stage1ActionButton;