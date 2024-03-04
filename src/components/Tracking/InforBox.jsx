import { InfoWindow } from "@react-google-maps/api";
import { Component } from "react";
import { connect } from "react-redux";
import './map.css';
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { getStatusVehicle } from "../../utils/common";
class InforBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
        };
    }

    render() {
        let { information } = this.props;
        // console.log(information)

        return (
            <div>
                <div style={{ width: 280, textAlign: "left", padding: "10px 0" }}>
                    <div className="flex">
                        <div className="w-[66%]" style={{ fontSize: 14 }}>
                            <b>
                                Vehicle : {information.plateLicence}
                            </b>
                            <br />
                            <small style={{ color: "#B2BABB" }}>{information.driveInfo?.date_time}</small>
                            <br />
                        </div>
                        <div className="w-[34%]">
                            <div className="flex">
                                <div style={{ color: getStatusVehicle(information.driveInfo?.status, Number(information.driveInfo?.speed)), paddingRight: 8,  }}>
                                    <FaCircle style={{fontSize: 12}}></FaCircle>

                                </div>
                                
                                <small style={{ paddingRight: 5 }}>
                                    <b>{(information.driveInfo?.status)}</b>
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[10px]">
                        <div className="w-100 r-table-tooltip">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div>
                                        <i
                                            className="icon-map-marker-alt"
                                            style={{ paddingRight: 4, minfoinLeft: -4 }}
                                        />
                                        Location :
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );
    }
};

const mapStateToProps = (state) => ({
    information: state.mapTracking.information,
});

export default connect(mapStateToProps)(InforBox)
// export default InforBox;
