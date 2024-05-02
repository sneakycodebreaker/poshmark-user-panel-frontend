"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import Form from "react-bootstrap/Form";
import { selfShare } from "@/services/startSelfShare";
import io from "socket.io-client";

const socket = io("http://173.230.151.165:3001");

const SettingForm = () => {
  const [enableServices, setEnableServices] = useState(false);

  const [selfShare_, setSelfShare] = useState(false);
  const [partyShare, setPartyShare] = useState(false);
  const [communityShare, setCommunityShare] = useState(false);
  const [shareBack, setShareBack] = useState(false);
  const [enableShareBack, setEnableShareBack] = useState(false);
  const [conditionalShareBack, setConditionalShareBack] = useState(false);
  const [shareServiceString, setShareServiceString] = useState("");

  const [followCloset, setFollowCloset] = useState(false);
  const [enableFollowCloset, setEnableFollowCloset] = useState(false);
  const [followClosetCount, setFollowClosetCount] = useState("");
  const [followBack, setFollowBack] = useState(false);

  const [discountAvailability, setDiscountAvailability] = useState(false);
  const [enableDiscountAvailability, setEnableDiscountAvailability] =
    useState(false);
  const [discountAvailabilityCount, setDiscountAvailabilityCount] =
    useState("");
  const [noDiscount, setNoDiscount] = useState(false);

  function selfShareService(status) {
    let cookie = localStorage.getItem("closetCookies");
    let username = localStorage.getItem("closetUsername");

    if (status) {
      localStorage.setItem("closetServices", "selfShare");
      setShareServiceString((prevValue) => prevValue + "selfShare");
      selfShare(cookie, username);
      return;
    } else {
      localStorage.removeItem("closetServices");
      setShareServiceString((prevValue) => prevValue.replace("selfShare", ""));
      socket.emit("stopProcess");
      setShareServiceString(prevValue => prevValue.replace(/selfShare(,|$)/g, ''));
    }
  }

  useEffect(() => {
    let services = localStorage.getItem("closetServices");
    if (services !== null) {
      setEnableServices(true);
      if (services === "selfShare") {
        setSelfShare(true);
      }
    }
  }, []);
  return (
    <>
      {/* Enable Services */}
      <div className="flex items-center my-3 ">
        <div className="w-1/2">
          <h6 className="text-lg" >Enable services</h6>
        </div>
        <div className="w-1/2 flex justify-end">
          <Form.Check // prettier-ignore
             type={'switch'}
            checked={enableServices} 
            onChange={(e) => {
              setEnableServices(e.currentTarget.checked);
            }}
          />
        </div>
      </div>

      {/* Services */}
      {enableServices && (
        <div>
          <div className="flex flex-col gap-3">
            {/* Share */}
            <div className="border-b pb-2">
              <h6 className="text-lg pb-2">Share</h6>
              <div className="space-y-2">
                <label
                  htmlFor="self-share-checkbox"
                  className="flex items-center"
                >
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    defaultChecked={selfShare_}
                    onClick={(e) => {
                      setSelfShare(e.currentTarget.checked);
                      selfShareService(e.currentTarget.checked);
                    }}
                  />
                  <span className="ml-2">Self share</span>
                </label>
                <label
                  htmlFor="party-share-checkbox"
                  className="flex items-center"
                >
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    defaultChecked={partyShare}
                    onClick={(e) => {
                      setPartyShare(e.currentTarget.checked);
                    }}
                  />
                  <span className="ml-2">Party share</span>
                </label>
                <label
                  htmlFor="community-share-checkbox"
                  className="flex items-center"
                >
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    defaultChecked={communityShare}
                    onClick={(e) => {
                      setCommunityShare(e.currentTarget.checked);
                    }}
                  />
                  <span className="ml-2">Community share</span>
                </label>
                <label
                  htmlFor="share-back-checkbox"
                  className="flex items-center"
                >
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    defaultChecked={shareBack}
                    onClick={(e) => {
                      setShareBack(e.currentTarget.checked);
                      setEnableShareBack(e.currentTarget.checked);
                      e.target.checked === "false"
                        ? ""
                        : setConditionalShareBack(e.target.checked);
                    }}
                  />
                  <span className="ml-2">Share back</span>
                </label>
                {enableShareBack && (
                  <label
                    htmlFor="conditional-share-back-checkbox"
                    className="flex items-center ml-2"
                  >
                    <Checkbox
                      onClick={(e) => {
                        setConditionalShareBack(
                          e.target.getAttribute("aria-checked") === "false"
                            ? true
                            : false
                        );
                      }}
                    />
                    <Form.Check // prettier-ignore
                      type={"checkbox"}
                      defaultChecked={conditionalShareBack}
                      onClick={(e) => {
                        setConditionalShareBack(e.currentTarget.checked);
                      }}
                    />
                    <span className="ml-2">
                      Share items back of each closet
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Follow */}
            <div className="border-b pb-2">
              <h6 className="text-lg pb-2">Follow</h6>
              <div className="space-y-2">
                <label
                  htmlFor="follow-closet-checkbox"
                  className="flex items-center"
                >
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    defaultChecked={followCloset}
                    onClick={(e) => {
                      setFollowCloset(e.currentTarget.checked);
                      setEnableFollowCloset(e.currentTarget.checked);
                      e.target.checked === false
                        ? setFollowClosetCount("")
                        : "";
                    }}
                  />
                  <span className="ml-2">Follow closet</span>
                </label>
                {enableFollowCloset && (
                  <div className="ml-2 my-2">
                    <label
                      htmlFor="follow-closet-count-selector"
                      className="block"
                    >
                      Number of closets to follow
                    </label>

                    <Form.Select
                      size="sm"
                      value={followClosetCount}
                      onChange={(e) => {
                        setFollowClosetCount(e.target.value);
                      }}
                    >
                      <option>Open to select</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="250">300</option>
                    </Form.Select>
                  </div>
                )}
                <label
                  htmlFor="follow-back-checkbox"
                  className="flex items-center"
                >
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    defaultChecked={followBack}
                    onClick={(e) => {
                      setFollowBack(e.currentTarget.checked);
                    }}
                  />
                  <span className="ml-2">Follow back</span>
                </label>
              </div>
            </div>

            {/* Offers */}
            <div className="space-y-1">
              <h6 className="text-lg pb-2">Offers</h6>
              <label htmlFor="discount-checkbox" className="flex items-center">
                <Form.Check // prettier-ignore
                  type={"checkbox"}
                  defaultChecked={discountAvailability}
                  onClick={(e) => {
                    setDiscountAvailability(e.currentTarget.checked);
                    setEnableDiscountAvailability(e.currentTarget.checked);
                    e.target.checked === false
                      ? ""
                      : (setDiscountAvailabilityCount(""),
                        setNoDiscount(e.target.checked));
                  }}
                />
                <span className="ml-2">Discount</span>
              </label>
              {enableDiscountAvailability && (
                <>
                  <div className="ml-2 my-2">
                    <label
                      htmlFor="discount-percentage-selector"
                      className="block"
                    >
                      Discount percentage
                    </label>

                    <Form.Select
                      size="sm"
                      value={discountAvailabilityCount}
                      onChange={(e) => {
                        setDiscountAvailabilityCount(e.target.value);
                      }}
                    >
                      <option>Open to select</option>
                      <option value="4.99">4.99</option>
                      <option value="5.99">5.99</option>
                    </Form.Select>
                  </div>
                  <label
                    htmlFor="no-discount-checkbox"
                    className="flex items-center ml-2"
                  >
                    <Checkbox
                      onClick={(e) => {
                        setNoDiscount(
                          e.target.getAttribute("aria-checked") === "false"
                            ? true
                            : false
                        );
                      }}
                    />
                    <Form.Check // prettier-ignore
                      type={"checkbox"}
                      defaultChecked={noDiscount}
                      onClick={(e) => {
                        setNoDiscount(e.currentTarget.checked);
                      }}
                    />
                    <span className="ml-2">No discount</span>
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingForm;
