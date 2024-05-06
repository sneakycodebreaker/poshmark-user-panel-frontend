"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import Form from "react-bootstrap/Form";
import { selfShare } from "@/services/startSelfShare";
import { fetchCloset } from "@/services/fetchCloset";
import io from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchSettings } from "@/services/fetchSettings";
import { addSettings } from "@/services/addSettings";
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
  const [connectedCloset,setConnectedCloset] = useState([]);
  const [selectedCloset, setSelectedCloset] = useState(null);

  const [selectedClosetId,setSelectedClosetId] = useState('');
  const [selectedClosetCookie,setSelectedClosetCookie] = useState('');
  const [selectedClosetName,setSelectedClosetName] = useState('');

  const [shareSettingString,setShareSettingString] = useState('');

  const [loadings,setLoadings] = useState(false);

  async function fetchCloset_(){
    let userId = localStorage.getItem('userId');
    let response = await fetchCloset(userId);
    setConnectedCloset(response?.closets);
  }
  function selfShareService(status) {
    let cookie = selectedClosetCookie;
    let username = selectedClosetName;

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

  async function fetchSettings_(closetId){
    setLoadings(true);
    let userId = localStorage.getItem('userId');
    let response = await fetchSettings(userId,closetId);
    

    if(response?.closets.length > 0 && (response?.closets[0]?.share !== '' || response?.closets[0]?.follow !== ''))
    {
      setEnableServices(true);
      if(response?.closets[0]?.share.includes('self-share'))
      {
        setSelfShare(true);
        setShareSettingString(response?.closets[0]?.share);
      }
    }
    setLoadings(false);
  }


    async function addSettings_(input,status){
      let userId = localStorage.getItem('userId');
      let setting = shareSettingString;
      if(status === true)
      {
        setting = setting + (setting === '' ? '' : ",") + input;
      }
      if(status === false)
      {
        setting = setting.replace(input, '');
      } 
      setShareSettingString(setting);
      addSettings(userId,selectedClosetId,setting,'')
    }

  useEffect(() => {
    fetchCloset_()
  }, []);
  return (
    <>
      {/* Connected Closet */}
      <div className="py-2 px-4 flex flex-col gap-2 bg-white rounded mt-3">
        <h4 className="font-semibold border-b pb-1">Connected Closets</h4>
        <div className="flex flex-row gap-3 ">     
          {
            connectedCloset.map((closet,index)=>(
              <div key={index} className={`${selectedCloset == index ? 'border-b-2 border-blue-500' : ''} pb-2 `} onClick={()=>{
                setSelectedCloset(index); 
                setSelectedClosetCookie(closet.cookie);
                setSelectedClosetName(closet.closetname);
                setSelectedClosetId(closet.closet_id);
                fetchSettings_(closet.closet_id)
                }}>
                  <Avatar className='cursor-pointer w-10 h-10' >
                  <AvatarImage src={closet.closet_img}  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar> 
              </div>
            
            ))
          }
        </div>
      </div>
      

      {/* Enable Services */}
      <div className="flex items-center my-3 ">
        {
          loadings ? 
          <p className="text-center">Fetching settings...</p>
          :
          <>
            <div className="w-1/2">
              <h6 className="text-lg" >Enable services</h6>
            </div>
            <div className="w-1/2 flex justify-end">
              <Form.Check // prettier-ignore
                disabled ={selectedCloset === null ? true : false}
                type={'switch'}
                checked={enableServices} 
                onChange={(e) => {
                  setEnableServices(e.currentTarget.checked);
                }}
              />
            </div>
          </>
        }

        
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
                      addSettings_("self-share",e.currentTarget.checked);
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
