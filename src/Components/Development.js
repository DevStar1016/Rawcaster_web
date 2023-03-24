import React, { useState, useEffect } from "react";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";

const Development = () => {
  return (
    <div className="d-flex justify-content-center align-items-center h-100 pt-5 mt-5">
      <FilerobotImageEditor
        source="https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg"
        onSave={(editedImageObject, designState) =>
          console.log("saved", editedImageObject, designState)
        }
        annotationsCommon={{
          fill: "#ff0000",
        }}
        avoidChangesNotSavedAlertOnLeave={true}
        Text={{ text: "Filerobot..." }}
        Rotate={{ angle: 90, componentType: "slider" }}
        Crop={{
          presetsItems: [
            {
              titleKey: "classicTv",
              descriptionKey: "4:3",
              ratio: 4 / 3,
            },
            {
              titleKey: "cinemascope",
              descriptionKey: "21:9",
              ratio: 21 / 9,
            },
          ],
          presetsFolders: [
            {
              titleKey: "socialMedia",

              groups: [
                {
                  titleKey: "facebook",
                  items: [
                    {
                      titleKey: "profile",
                      width: 180,
                      height: 180,
                      descriptionKey: "fbProfileSize",
                    },
                    {
                      titleKey: "coverPhoto",
                      width: 820,
                      height: 312,
                      descriptionKey: "fbCoverPhotoSize",
                    },
                  ],
                },
              ],
            },
          ],
        }}
        tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FILTERS, TABS.RESIZE]}
        defaultTabId={TABS.ANNOTATE}
        defaultToolId={TOOLS.TEXT}
        onBeforeSave={(imageFileInfo) => {
          console.log(imageFileInfo);
        }}
        moreSaveOptions={[
          {
            label: "Save as new file",
            onClick: (triggerSaveModal, triggerSave) =>
              triggerSave((...args) => {
                console.log("saved", args);
              }), // Required to pass the callback function
          },
        ]}
      />
    </div>
  );
};

export default Development;
