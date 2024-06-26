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
import { followBack_ } from "@/services/followback";
import { shareBack_ } from "@/services/shareback";
import { communityShare_ } from "@/services/communityShare";
import { followNewPoshers_ } from "@/services/followNewPoshers";
const socket = io("http://173.230.151.165:3001");

const SettingForm = () => {
  const [enableServices, setEnableServices] = useState(false);

  const [selfShare_, setSelfShare] = useState(false);
  const [partyShare, setPartyShare] = useState(false);
  const [communityShare, setCommunityShare] = useState(false);
  const [shareBack, setShareBack] = useState(false);
  const [enableShareBack, setEnableShareBack] = useState(false);
  const [conditionalShareBack, setConditionalShareBack] = useState(2);
  const [shareServiceString, setShareServiceString] = useState("");

  const [followCloset, setFollowCloset] = useState(false);
  const [enableFollowCloset, setEnableFollowCloset] = useState(false);
  const [followClosetCount, setFollowClosetCount] = useState("");
  const [followBack, setFollowBack] = useState(false);
  const [followNewPoshers, setFollowNewPoshers] = useState(false);

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
  const [followSettingString,setFollowSettingString] = useState('');

  const [loadings,setLoadings] = useState(false);

  async function fetchCloset_(){
    let userId = localStorage.getItem('userId');
    let response = await fetchCloset(userId);
    setConnectedCloset(response?.closets);
  }

  function selfShareService(status) {
    let userId = localStorage.getItem('userId');
    let cookie = selectedClosetCookie;
    let username = selectedClosetName;
    if (status) {
      selfShare(userId,selectedClosetId,cookie, username);
      return;
    } else {
      socket.emit("stopProcessSelfShare",userId,selectedClosetId);
    }
  }

  function followBackService(status) {
    let userId = localStorage.getItem('userId');
    let cookie = selectedClosetCookie;

    if (status) {
      followBack_(userId,selectedClosetId,cookie);
      return;
    } else {
      socket.emit("stopProcessFollowBack",userId,selectedClosetId);
    }
  }

  function shareBackService(status) {
    let userId = localStorage.getItem('userId');
    let cookie = selectedClosetCookie;

    if (status) {
      shareBack_(userId,selectedClosetId,cookie);
      return;
    } else {
      socket.emit("stopProcessShareBack",userId,selectedClosetId);
    }
  }

  function communityShareService(status) {
    let userId = localStorage.getItem('userId');
    let cookie = selectedClosetCookie;

    if (status) {
      communityShare_(userId,selectedClosetId,cookie);
      return;
    } else {
      socket.emit("stopProcessCommunityShare",userId,selectedClosetId);
    }
  }

  function followNewPoshersService(status) {
    let userId = localStorage.getItem('userId');
    let cookie = selectedClosetCookie;

    if (status) {
      followNewPoshers_(userId,selectedClosetId,cookie);
      return;
    } else {
      socket.emit("stopProcessFollowNewPoshers",userId,selectedClosetId);
    }
  }


  async function fetchSettings_(closetId){
    setLoadings(true);

    setEnableServices(false);
    setSelfShare(false);
    setShareBack(false);
    setCommunityShare(false);
    setFollowBack(false);
    setFollowNewPoshers(false)
    setEnableFollowCloset(false);

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
      if(response?.closets[0]?.share.includes('share-back'))
      {
        setShareBack(true);
        setShareSettingString(response?.closets[0]?.share);
      }
      if(response?.closets[0]?.share.includes('community-share'))
      {
        setCommunityShare(true);
        setShareSettingString(response?.closets[0]?.share);
      }
      if(response?.closets[0]?.follow.includes('follow-back'))
      {
        setFollowBack(true);
       
        setFollowSettingString(response?.closets[0]?.follow);
      }
      if(response?.closets[0]?.follow.includes('follow-new-poshers'))
      {
        setFollowNewPoshers(true);
       
        setFollowSettingString(response?.closets[0]?.follow);
      }
    }
    setLoadings(false);
  }


    async function addSettings_(input,status){
      let userId = localStorage.getItem('userId');
      let setting_share = shareSettingString;
      let setting_follow = followSettingString;
      if(status === true && input.includes("self-share") === true)
      {
        setting_share = setting_share + (setting_share === '' ? '' : ",") + input;
      }
      if(status === false  && input.includes("self-share") === true)
      {
        setting_share = setting_share.replace(input, '');
      } 

      if(status === true && input.includes("share-back") === true)
      {
        setting_share = setting_share + (setting_share === '' ? '' : ",") + input;
      }
      if(status === false  && input.includes("share-back") === true)
      {
        setting_share = setting_share.replace(input, '');
      } 

      if(status === true && input.includes("community-share") === true)
      {
        setting_share = setting_share + (setting_share === '' ? '' : ",") + input;
      }
      if(status === false  && input.includes("community-share") === true)
      {
        setting_share = setting_share.replace(input, '');
      } 

      if(status === true && input.includes("follow-back") === true)
      {
        setting_follow = setting_follow + (setting_follow === '' ? '' : ",") + input;
      }
      if(status === false  && input.includes("follow-back") === true)
      {
        setting_follow = setting_follow.replace(input, '');
      } 

      if(status === true && input.includes("follow-new-poshers") === true)
      {
        setting_follow = setting_follow + (setting_follow === '' ? '' : ",") + input;
      }
      if(status === false  && input.includes("follow-new-poshers") === true)
      {
        setting_follow = setting_follow.replace(input, '');
      } 

      setting_share =   replaceCommas(setting_share);
      setting_follow =   replaceCommas(setting_follow);
      
      setShareSettingString(setting_share);
      setFollowSettingString(setting_follow);
      addSettings(userId,selectedClosetId,setting_share,setting_follow);

    }

    function replaceCommas(inputString) {
      if (/^,+$/g.test(inputString)) {
          return inputString.replace(/,/g, '');
      } else {
          return inputString;
      }
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
              <div 
                className="flex flex-row gap-2 items-center"
                key={index}>
                  <Form.Check
                    type={'radio'}
                    name="closet"
                    checked={selectedCloset === index}
                    onChange={(e) => {
                      setSelectedCloset(index); 
                      setSelectedClosetCookie(closet.cookie);
                      setSelectedClosetName(closet.closetname);
                      setSelectedClosetId(closet.closet_id);
                      fetchSettings_(closet.closet_id);
                      setEnableServices(false)
                    }}
                  />
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
                  selfShare_ === true ? [selfShareService(false),addSettings_('self-share',false)] : '';
                  shareBack === true ? [shareBackService(false),addSettings_('share-back',false)] : '';
                  followBack === true ? [followBackService(false),addSettings_('follow-back',false)] : '';               
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
                      addSettings_("community-share",e.currentTarget.checked);
                      setCommunityShare(e.currentTarget.checked);
                      communityShareService(e.target.checked);
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
                      addSettings_("share-back",e.currentTarget.checked);
                      shareBackService(e.target.checked);       
                      setShareBack(e.currentTarget.checked);
                      setEnableShareBack(e.currentTarget.checked);
                      e.target.checked === "false"
                        ? ""
                        : setConditionalShareBack('');
                    }}
                  />
                  <span className="ml-2">Share back</span>
                </label>
                {enableShareBack && (
                  <label
                    htmlFor="conditional-share-back-checkbox"
                    className="flex items-center ml-2"
                  >
                    <span className="ml-2">
                      Share 
                    </span>
                      <Form.Control
                      value={2}
                      disabled={true}
                      size="sm"
                      className="w-12 mx-2 flex justify-items-center items-center"
                      type="text"
                      onChange={(e)=>{
                        setConditionalShareBack(e.target.value.replace(/[^1-5]/g, '').slice(0, 1))
                      }}
                
                    />
                   <span className="">
                     items back of each closet
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
                      // e.target.checked === false
                      //   ? setFollowClosetCount("")
                      //   : "";
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
                  <Form.Check
                    type={"checkbox"}
                    defaultChecked={followBack}
                    onClick={(e) => {
                      setFollowBack(e.currentTarget.checked);
                      addSettings_('follow-back',e.currentTarget.checked);
                      followBackService(e.currentTarget.checked);
                    }}
                  />
                  <span className="ml-2">Follow back</span>
                </label>


                {/* <label
                  htmlFor="follow-back-checkbox"
                  className="flex items-center"
                >
                  <Form.Check
                    type={"checkbox"}
                    defaultChecked={followNewPoshers}
                    onClick={(e) => {
                      setFollowNewPoshers(e.currentTarget.checked);
                      followNewPoshersService(e.currentTarget.checked);
                      addSettings_('follow-new-poshers',e.currentTarget.checked);
                    }}
                  />
                  <span className="ml-2">Follow new poshers</span>
                </label> */}
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
