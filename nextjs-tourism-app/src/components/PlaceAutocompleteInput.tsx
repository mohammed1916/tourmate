import React, { useEffect, useRef } from 'react';

interface PlaceAutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  id: string;
}

const PlaceAutocompleteInput: React.FC<PlaceAutocompleteInputProps> = ({ value, onChange, placeholder, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pacRef = useRef<any>(null);

  useEffect(() => {
    if (!window.google?.maps?.places?.PlaceAutocompleteElement || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    // Create the element with an empty options object
    const pac = new window.google.maps.places.PlaceAutocompleteElement({});
    pacRef.current = pac;
    containerRef.current.appendChild(pac);

    // Set value, placeholder, and id directly after creation
    setTimeout(() => {
      // @ts-ignore: value is supported at runtime
      pac.value = value || '';
      const input = pac.shadowRoot?.querySelector('input');
      if (input) {
        input.placeholder = placeholder;
        input.id = id;
        input.autofocus = true;
        input.focus();
      }
    }, 0);

    pac.addEventListener('gmp-placeautocomplete-placechange', (event: any) => {
      const place = event.target.value;
      onChange(place?.structured_formatting?.main_text || place?.description || '');
    });

    return () => {
      containerRef.current && (containerRef.current.innerHTML = '');
    };
  }, [placeholder, id]);

  useEffect(() => {
    if (pacRef.current && value !== pacRef.current.value) {
      // @ts-ignore: value is supported at runtime
      pacRef.current.value = value || '';
    }
  }, [value]);

  return <div ref={containerRef} />;
};

export default PlaceAutocompleteInput;
