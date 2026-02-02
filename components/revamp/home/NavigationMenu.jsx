import Image from "next/image";
import { useRouter } from "next/router";
import {usePathname} from "next/navigation"
import { useCallback, useMemo, useState, useEffect } from "react";
import { TTW } from "../assets";
import { menuAnimations } from "../common/animations/menuAnimations";
import { useMobileMenu } from "../common/hooks/useMobileMenu";
import styles from "./NavigationMenu.module.scss";
import SearchInput from "../common/components/searchInput";
import Button from "../common/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { connect, useDispatch, useSelector } from "react-redux";
import {  authShowLogin, authCloseLogin } from "../../../store/actions/auth";
import useMediaQuery from "../../media";
import ProfileDropDown from "../../navbar/ProfileDropDown";
import { authLogout } from "../../../store/actions/auth";
import MobileMenu from "../../navbar/mobile/Index";
import ImageLoader from "../../ImageLoader";
import * as logout from "../../../store/actions/logout";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import setHotLocationSearch from "../../../store/actions/hotLocationSearch";
import Login from "../../modals/Login";
import TailoredFormMobileModal from "../../modals/TailoredFomrMobile";

const NavigationMenu = (props) => {
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    sidebarRef,
    overlayRef,
    menuItemsRef,
  } = useMobileMenu();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropDownProfileList, setShowDropDownProfileList] = useState(false);
  const [showDropDownProfileListMobile, setShowDropDownProfileListMobile] = useState(false);
  const isMidScreen = useMediaQuery("(min-width:786px)");
  const [Height, setHeight] = useState(false);
  const [showMobileNavItems, setShowMobileNavItems] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const itinerary = useSelector(state=>state.Itinerary);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  const dispatch = useDispatch();
  // Memoized active path checker to prevent unnecessary re-renders
  const isActive = useCallback(
    (path) => router.pathname.startsWith(path),
    [router.pathname]
  );
  const slideIndex = Number(router.query.slideIndex) || 0;


  // Memoized handlers to prevent unnecessary re-renders
  const handleMenuItemHover = useCallback((element, isHovering) => {
    menuAnimations.hoverMenuItem(element, isHovering);
  }, []);

  const handleCTAClick = useCallback(
    (e) => {
      menuAnimations.pulseCTA(e.target);
      dispatch(authShowLogin());
      closeMobileMenu();
    },
    [closeMobileMenu]
  );

  // Memoized menu items to prevent unnecessary re-renders
  const desktopMenuItems = useMemo(
    () => [], // Empty array since navigation items are removed
    [isActive]
  );

  const mobileMenuItems = useMemo(
    () => [], // Empty array since navigation items are removed
    [isActive, closeMobileMenu, handleMenuItemHover]
  );
  const toggleProfileList = () => {
    setShowDropDownProfileList(!showDropDownProfileList);
    setShowDropDownProfileListMobile(!showDropDownProfileListMobile);
    if (showMobileNavItems == true) {
      setShowMobileNavItems(false);
    }
    if (showMobileNavItems == false) {
      setHeight(!Height);
    }
  };
  const _deleteNotificationHandler = (id) => {};

  const _openAllNotificationsHandler = () => {};
  useEffect(() => {
    axios.get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`).then((res) => {
      dispatch(setHotLocationSearch(res.data));
    });
  }, [props]);

  const attachUserToItinerary = async () => {
  if (itinerary?.customer) {
    return; 
  }
  
  try {
    const response = await axios.get(
      `${MERCURY_HOST}/api/v1/itinerary/${router.query.id}/attach-user/`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
      
  
  } catch (error) {
    console.error('Error attaching user to itinerary:', error);
  }
};


  return (
    <>
    <div className="w-100 bg-text-white"> 
      <nav className={styles.navigationMenu + " " + props.className + " max-ph:!p-md max-ph:shadow-soft"} role="navigation">
        <div className="hover-pointer" onClick={() => router.push("/")}>
          <Image src={TTW} alt="TTW Logo" priority  />
        </div>
        {isMidScreen &&pathname!="/new-trip"&& <SearchInput />}
        {/* Desktop Menu */}
        <ul className={styles.menuList} role="menubar">
          <li className="mr-4"></li>
          {desktopMenuItems}
          <li></li>
          {props.token?<>{(pathname!="/dashboard"&&pathname!="/new-trip")&&<button className="MediumIndigoButton" onClick={()=>router.push("/dashboard")}>
                  My Trips
          </button>}</>: null}
          
          {(pathname!="/new-trip")&& (!pathname?.includes("/itinerary")) && pathname=="/dashboard"&& <button className="MediumIndigoButton" onClick={()=>setShowMobilePlanner(true)}>
                  Create a trip
          </button>}
          
          {localStorage.getItem("access_token") ? (
            <ProfileDropDown 
            name={props.name}
            image={props.image}
            onLogout={props.onLogout}
            authShowLogin={props.authShowLogin}
            setShowDropDownProfileList={setShowDropDownProfileList}
            showDropDownProfileList={showDropDownProfileList}
            showDropDownProfileListMobile={showDropDownProfileListMobile}
            notifications={[]}
            toggleProfileList={toggleProfileList}
            token={localStorage.getItem("access_token")}
            />
          ) : (
            <Button size="small" onClick={handleCTAClick}>
              Login/Signup
            </Button>
          )}
        </ul>

        {/* Hamburger Menu Button */}
        <div className="flex gap-2 md:hidden">
        {props.token?<>{(pathname!="/dashboard"&&pathname!="/new-trip")&&<button className="MediumIndigoButton mt-2 max-sm:text-[12px] " onClick={()=>router.push("/dashboard")}>
                  My Trips
        </button>}</>:<>{(pathname!="/dashboard"&&pathname!="/new-trip")&&<button className="MediumIndigoButton mt-2 max-sm:text-[12px]" onClick={()=>setShowMobilePlanner(true)}>
                  Create a trip
        </button>}</>}
          <MobileMenu 
          id={props.id}
          _openAllNotificationsHandler={_openAllNotificationsHandler}
          hidecta={false}
          ctaonclick={handleCTAClick}
          _deleteNotificationHandler={_deleteNotificationHandler}
          notifications={[]}
          hideNav={hideNav}
          showMobileSearch={false}
          setShowMobileSearch={()=>{}}
          setHideNav={setHideNav}
          notOpenCount={null}
          setShowLoginModal={authShowLogin}
          staticnav ={true}
          itinerary={true}
          handleCTAClick={handleCTAClick}
          />
          
          {/* {!props.token?<Button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            variant="filled"
          >
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
          </Button>:<ImageLoader
          borderRadius="50%"
          url={
            props.image !== "null" && props.image !== null
              ? props.image
              : "media/icons/navigation/profile-user.png"
          }
          noPlaceholder={true}
          width="48px"
          height="48px"
        />
          } */}
        </div>
      </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        ref={overlayRef}
        className={styles.mobileOverlay}
        onClick={toggleMobileMenu}
        role="button"
        tabIndex={-1}
        aria-hidden={!isMobileMenuOpen}
        onKeyDown={(e) => e.key === "Enter" && toggleMobileMenu()}
      />

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={styles.mobileSidebar}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className={styles.sidebarHeader}>
          <Image src={TTW} alt="TTW Logo" className={styles.sidebarLogo}  />
          <button
            className={styles.closeButton}
            onClick={toggleMobileMenu}
            aria-label="Close mobile menu"
            type="button"
          >
            ×
          </button>
        </div>

        <ul className={styles.mobileMenuList} role="menu">
          {mobileMenuItems}
        </ul>

        <div
          ref={(el) => (menuItemsRef.current[0] = el)}
          className={styles.sidebarActions}
        >
          <button
            className={`cta-button ${styles.mobileCta}`}
            onClick={handleCTAClick}
            type="button"
          >
            Get Started
          </button>
        </div>
        {slideIndex!=4&&<div id="login" className="width-[100%] z-[1650]">
        <Login
          show={props.showLogin}
          onhide={props.authCloseLogin}
          itinary_id={props?.itinary_id}
          zIndex={"3300"}
          message={props?.message}
          onSuccess={async ()=>{
            if(props?.isItinerary && router.query.id){
              await attachUserToItinerary();
            }
          }}
        />
      </div>}
      </div>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => {
          setShowMobilePlanner(false);
          // closeTailoredModal(router);
        }}
        show={showMoiblePlanner}
      />

    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    name: state.auth.name,
    image: state.auth.image,
    showLogin: state.auth.showLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout.logout()),
    authShowLogin: () => dispatch(authShowLogin()),
    authCloseLogin: () => dispatch(authCloseLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationMenu);