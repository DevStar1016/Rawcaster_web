import React, { useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID } from "../Shared/Constant";

const Development = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    let maxResults = 1000;
    return new Promise(async (resolve, reject) => {
      try {
        // Step 1: Load the Google API client library
        await new Promise((resolve, reject) => {
          window.gapi.load("client", resolve);
        });

        // Step 2: Initialize the client library
        await window.gapi.client.init({
          clientId: GOOGLE_CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
          ],
          scope: "https://www.googleapis.com/auth/contacts.other.readonly",
        });

        // Step 3: Authenticate and fetch contacts
        await window.gapi.auth2.getAuthInstance().signIn();
        const response = await window.gapi.client.people.otherContacts.list({
          pageSize: maxResults,
          readMask: "names,emailAddresses,photos",
        });
        resolve(response.result.otherContacts);
      } catch (error) {
        reject(error);
      }
    });
  };
  return (
    <div className="h-100 pt-5 mt-5 m-auto w-25">
      <button
        onClick={() => {
          fetchContacts();
        }}
      >
        Get Google Contacts{" "}
      </button>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.resourceName}>
            <p>
              Name:{" "}
              {contact.names?.[0]?.displayName ??
                contact.emailAddresses?.[0]?.value}
            </p>
            <p>Email: {contact.emailAddresses?.[0]?.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Development;
