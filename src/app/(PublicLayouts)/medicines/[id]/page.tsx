"use client"
import { useParams } from 'next/navigation';

const MedicinesDetails = () => {
    const {id} = useParams();
    return (
        <div>
            {id}
        </div>
    );
};

export default MedicinesDetails;